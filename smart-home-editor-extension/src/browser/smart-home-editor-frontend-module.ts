/**
 * Generated using theia-extension-generator
 */

import { SmartHomeEditorCommandContribution, SmartHomeEditorMenuContribution } from './smart-home-editor-contribution';
import {
  CommandContribution,
  MenuContribution
} from "@theia/core/lib/common";
import { ContainerModule } from "inversify";
import { WidgetFactory, OpenHandler } from "@theia/core/lib/browser";
import { ResourceProvider, Resource } from "@theia/core/lib/common";
import { ResourceSaveable, TreeEditorWidget, TreeEditorWidgetOptions, TheiaTreeEditorContribution } from "theia-tree-editor";
import URI from "@theia/core/lib/common/uri";
import App, { initStore } from "../App";
import { ThemeService } from '@theia/core/lib/browser/theming';

import { getData } from "@jsonforms/core";

const LIGHT_THEME_ID = "light"

class MyResourceSaveable extends ResourceSaveable {
  constructor(resource: Resource, getData: () => any) {
    super(resource, getData);
  }
  onSave(data: any) {
    console.log(data);

    return postRequest('http://localhost:9091/services/convert/json', data, 'application/json')
    .then(response => {
      return super.onSave(response.text())
    })
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
  bind(MenuContribution).to(SmartHomeEditorMenuContribution);
  bind<WidgetFactory>(WidgetFactory).toDynamicValue(ctx => ({
    id: 'theia-tree-editor',
    async createWidget(uri: string): Promise<TreeEditorWidget> {
      const { container } = ctx;
      const resource = await container.get<ResourceProvider>(ResourceProvider)(new URI(uri));
      const store = await initStore();
      const child = container.createChild();
      child.bind<TreeEditorWidgetOptions>(TreeEditorWidgetOptions)
        .toConstantValue({
          resource,
          store,
          EditorComponent: App,
          fileName: new URI(uri).path.base,
          saveable: new MyResourceSaveable(resource, () => getData(store.getState())),
          onResourceLoad: contentAsString => {
            return postRequest('http://localhost:9091/services/convert/xmi', contentAsString, 'application/xml')
              .then(response => {
                return response.json()
              })
          }
        });
      return child.get(TreeEditorWidget);
    }
  }));
  bind(TreeEditorWidget).toSelf();
  bind(TheiaTreeEditorContribution).toSelf().inSingletonScope();
  [CommandContribution, MenuContribution, OpenHandler].forEach(serviceIdentifier =>
    bind(serviceIdentifier).toService(TheiaTreeEditorContribution)
  );
});
