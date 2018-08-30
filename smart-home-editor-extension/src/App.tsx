import * as React from "react";
import { defaultProps } from 'recompose';
import { combineReducers, createStore, Store } from 'redux';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';
import {
  Actions,
  jsonformsReducer,
  RankedTester,
  JsonSchema,
  resolveData
} from '@jsonforms/core';
import { /*calculateLabel,*/ filterPredicate } from 'theia-tree-editor';
import { Work } from "@material-ui/icons";
const JsonRefs = require("json-refs");

import schema from './schema';

import {labels, modelMapping, uischemas} from './config';
import SmartHomeEditor from './SmartHomeEditor';
import { InstanceLabelProvider, SchemaLabelProvider } from '@jsonforms/material-tree-renderer/lib/helpers/LabelProvider';
import { Icon } from "@material-ui/core";


//const imageGetter = (schemaId: string) => 'icon-test';
// !_.isEmpty(imageProvider) ? `icon ${imageProvider[schemaId]}` : '';

let resolvedSchema;

export const initStore = async() => {
  const uischema = {
    'type': 'TreeWithDetail',
    'scope': '#'
  };
  const renderers: { tester: RankedTester, renderer: any}[] = materialRenderers;
  const fields: { tester: RankedTester, field: any}[] = materialFields;
  const jsonforms: any = {
    jsonforms: {
      renderers,
      fields,
      treeWithDetail: {
        // imageMapping: imageProvider,
        labelMapping: labels,
        modelMapping,
        uiSchemata: uischemas
      }
    }
  };
  await JsonRefs.resolveRefs(schema).then(res => resolvedSchema = res.resolved)

  const store: Store<any> = createStore(
    combineReducers({
        jsonforms: jsonformsReducer()
      }
    ),
    { ...jsonforms }
  );

  store.dispatch(Actions.init({}, schema, uischema));

  return store;
};

const instanceLabelProvider: InstanceLabelProvider = (schema: JsonSchema, data: any) => {
  return data.name;
}

const schemaLabelProvider: SchemaLabelProvider = (jsonSchema: JsonSchema, schemaPath: string) => {

  console.log(":::", schemaPath);

  const x = resolveData(resolvedSchema, schemaPath.substring(1));
  const y = resolveData(resolvedSchema, "properties.requiredStates.items.anyOf.2.anyOf.0");
  console.log("XX ", x)
  console.log("YY ", y)


  if (x != undefined && x["$id"] === "#onOffActor") {
    return "On/Off Actor";
  }
  else {
    return "state"
  }
}

const imageProvider = (schema: JsonSchema): React.ReactElement<any> | string => {
  console.log(schema);
  if (schema["$id"] === "#state") {
    return <Work />
  }

  return (<Icon/>)
}

export default defaultProps(
  {
    'filterPredicate': filterPredicate,
    'labelProviders': {
      forData: instanceLabelProvider,
      forSchema: schemaLabelProvider
    },
    'imageProvider': imageProvider
  }
)(SmartHomeEditor);
