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

import { getData } from "@jsonforms/core";

class MyResourceSaveable extends ResourceSaveable {
  constructor(resource: Resource, getData: () => any) {
    super(resource, getData);
  }
  onSave(data: any) {
    console.log("I was called during save");
    return super.onSave(data);
  }
}

function postRequest(url, data: String) {
  return fetch(url, {
    credentials: 'same-origin',
    method: 'POST',
    body: String(data),
    headers: new Headers({
      'Content-Type': 'application/xml'
    }),
  })
    .then(response => {
      return response.json()
    })
}

export default new ContainerModule(bind => {
  // add your contribution bindings here

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
            return postRequest('http://localhost:9091/services/convert/xmi', contentAsString)
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
