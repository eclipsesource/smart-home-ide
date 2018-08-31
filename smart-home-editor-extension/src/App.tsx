import * as React from "react";
import * as _ from 'lodash';
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
import { /*calculateLabel,*/ filterPredicate, TreeEditorApp } from 'theia-tree-editor';
import { Cached, ContactSupport, Person } from "@material-ui/icons";
const JsonRefs = require("json-refs");

import schema from './schema';

import {labels, modelMapping, uischemas} from './config';
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
  if (data.name !== undefined && data.name.length > 0) {
    return data.name;
  } else if (_.has(schema, '$id')) {
    return 'Unnamed ' + _.startCase(schema['$id'].substring(1));
  }

  return 'Unnamed object';
}

const dropLastAnyOfFromPath = (schemaPath: string): string => {
  const lastAnyOfIndex = schemaPath.lastIndexOf('anyOf');
  return schemaPath.substring(1, lastAnyOfIndex - 1);
}

const schemaLabelProvider: SchemaLabelProvider = (jsonSchema: JsonSchema, schemaPath: string) => {

  if (schemaPath.includes('requiredStates') || schemaPath.includes('providedState')) {
    const resolved = resolveData(resolvedSchema, dropLastAnyOfFromPath(schemaPath));
    if (resolved != undefined) {
      switch (resolved['$id']) {
        case '#booleanState':
          return 'Boolean State';
        case '#numberState':
          return 'Number State';
        case '#dateTimeState':
          return 'Datetime State';
        default:
          return 'Unknown State';
      }
    }
  } else if (schemaPath.includes('requiredActors')) {
    const resolved = resolveData(resolvedSchema, dropLastAnyOfFromPath(schemaPath));
    if (resolved != undefined) {
      switch (resolved['$id']) {
        case '#heatingActors':
          return 'Heating Actor';
        case '#lockUnlockActor':
          return 'Lock/Unlock Actor';
        case '#onOffActor':
          return 'On/Off Actor';
        case '#playPauseActor':
          return 'Play/Pause Actor';
        default:
          return 'Unknown Actor';
      }
    }
  } else if (schemaPath.includes('requiredParameters')) {
    const resolved = resolveData(resolvedSchema, dropLastAnyOfFromPath(schemaPath));
    if (resolved != undefined) {
      switch (resolved['$id']) {
        case '#booleanParameter':
          return 'Boolean Parameter';
        case '#dateTimeParameter':
          return 'Datetime Parameter';
        case '#numberParameter':
          return 'Number Parameter';
        default:
          return 'Unknown Parameter';
      }
    }
  }

  return "Unknown"
}

const imageProvider = (schema: JsonSchema): React.ReactElement<any> | string => {
  if (schema["$id"] === "#state") {
    return <Cached />
  } else if (schema['$id'] === '#parameter') {
    return <ContactSupport />
  } else if (schema['$id'] === '#actor') {
    return <Person />
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
)(TreeEditorApp);
