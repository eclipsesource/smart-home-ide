/**
 * Generated using theia-extension-generator
 */

import { SmartHomeEditorCommandContribution, SmartHomeEditorMenuContribution } from './smart-home-editor-contribution';
import {
  CommandContribution,
  MenuContribution,
  MessageService
} from "@theia/core/lib/common";
import { ContainerModule, injectable } from "inversify";
import { WidgetFactory, OpenHandler, WebSocketConnectionProvider } from "@theia/core/lib/browser";
import { ResourceProvider, Resource } from "@theia/core/lib/common";
import { ResourceSaveable, TreeEditorWidget, TreeEditorWidgetOptions } from "theia-tree-editor";
import URI from "@theia/core/lib/common/uri";
import App, { initStore } from "../App";
import { ThemeService } from '@theia/core/lib/browser/theming';
import { IYoServer, yoPath, IYoClient } from '../common/scaffolding-protocol';
import { getData } from "@jsonforms/core";
import { SmartHomeTreeEditorContribution } from './SmartHomeTreeEditorContribution';
import { JUnitResultOpenHandler } from './editor-contribution';
import { SCMCommandsContribution, SCMTasksContribution, SCMMenuActionsContribution } from './scm-task-contribution';
import { TaskContribution } from '@theia/task/lib/browser';

export * from '../common/smart-home-menu';
import { CodeGenerator } from './code-generator';

import '../../src/browser/style/index.css';
import { SmartHomeMenuContribution } from '../common/smart-home-menu';
const LIGHT_THEME_ID = "light"

class MyResourceSaveable extends ResourceSaveable {
  constructor(resource: Resource, getData: () => any, private messageService: MessageService, private codeGenerator: CodeGenerator) {
    super(resource, getData);
  }
  onSave(data: any) {
    return postRequest(window.location.protocol + '//' + window.location.hostname + ':9091/services/convert/json',
      JSON.stringify(data),
      'application/json')
      .then(response => {
        const appContents = response.text()
        appContents.then(app => this.codeGenerator.generateCode(app, data.className))
        return appContents
      }, () => this.messageService.error('Save was not possible.'))
  }
}

function postRequest(url, data: String, contentType) {
  return fetch(url, {
    credentials: 'same-origin',
    method: 'POST',
    body: String(data),
    headers: new Headers({
      'Content-Type': contentType
    }),
  })
}

export default new ContainerModule(bind => {
  // add your contribution bindings here
  ThemeService.get().setCurrentTheme(LIGHT_THEME_ID)
  bind(CommandContribution).to(SmartHomeEditorCommandContribution);

  // menu
  bind(MenuContribution).to(SmartHomeMenuContribution);
  bind(MenuContribution).to(SmartHomeEditorMenuContribution);

  bind(OpenHandler).to(JUnitResultOpenHandler)
  bind(CodeGenerator).to(CodeGenerator)
  bind<WidgetFactory>(WidgetFactory).toDynamicValue(ctx => ({
    id: 'theia-tree-editor',
    async createWidget(uri: string): Promise<TreeEditorWidget> {
      const { container } = ctx;
      const resource = await container.get<ResourceProvider>(ResourceProvider)(new URI(uri));
      const messageService = await container.get<MessageService>(MessageService)
      const codeGenerator = await container.get<CodeGenerator>(CodeGenerator)
      const store = await initStore();
      const child = container.createChild();
      child.bind<TreeEditorWidgetOptions>(TreeEditorWidgetOptions)
        .toConstantValue({
          resource,
          store,
          EditorComponent: App,
          fileName: new URI(uri).path.base,
          saveable: new MyResourceSaveable(resource, () => getData(store.getState()), messageService, codeGenerator),
          onResourceLoad: contentAsString => {
            return postRequest(
              window.location.protocol + '//' + window.location.hostname + ':9091/services/convert/xmi',
              contentAsString,
              'application/xml')
              .then(response => response.json(), () => messageService.error('Could not get App Manifest Editor contents.'))
          }
        });
      return child.get(TreeEditorWidget);
    }
  }));
  bind(TreeEditorWidget).toSelf();
  bind(SmartHomeTreeEditorContribution).toSelf().inSingletonScope();
  [CommandContribution, MenuContribution, OpenHandler].forEach(serviceIdentifier =>
    bind(serviceIdentifier).toService(SmartHomeTreeEditorContribution)
  );

  bind(SmartHomeYoClient).toSelf()
  bind(IYoServer).toDynamicValue(ctx => {
    const connection = ctx.container.get(WebSocketConnectionProvider);
    const client = ctx.container.get(SmartHomeYoClient)
    return connection.createProxy<IYoServer>(yoPath, client);
  }).inSingletonScope();

    // SCM
    bind(CommandContribution).to(SCMCommandsContribution);
    bind(MenuContribution).to(SCMMenuActionsContribution);
    bind(TaskContribution).to(SCMTasksContribution);
});

@injectable()
export class SmartHomeYoClient implements IYoClient {

}