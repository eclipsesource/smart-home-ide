import { defaultProps } from 'recompose';
import { combineReducers, createStore, Store } from 'redux';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';
import {
  Actions,
  jsonformsReducer,
  RankedTester
} from '@jsonforms/core';
import { calculateLabel, filterPredicate } from 'theia-tree-editor';

import schema from './schema';

import {labels, modelMapping, uischemas} from './config';
import SmartHomeEditor from './SmartHomeEditor';


const imageGetter = (schemaId: string) => 'icon-test';
// !_.isEmpty(imageProvider) ? `icon ${imageProvider[schemaId]}` : '';

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

export default defaultProps(
  {
    'filterPredicate': filterPredicate,
    'labelProvider': calculateLabel(labels),
    'imageProvider': imageGetter
  }
)(SmartHomeEditor);
