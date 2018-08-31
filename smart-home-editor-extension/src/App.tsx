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
import { filterPredicate, TreeEditorApp } from 'theia-tree-editor';
import { Cached, ContactSupport, Person } from "@material-ui/icons";
const JsonRefs = require("json-refs");
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import schema from './schema';

import { InstanceLabelProvider, SchemaLabelProvider } from '@jsonforms/material-tree-renderer/lib/helpers/LabelProvider';
import { Icon } from "@material-ui/core";
import {modelMapping} from "./config";

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
      fields
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

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#616161'
    },
    secondary: {
      main: '#d7eaf8',
      dark: '#26A69A'
    },
    background: {
      'default': '#1E1E1E'
    }
  },
  typography: {
    fontSize: 13,
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  overrides: {
    MuiButton: {
      fab: {
        width: '24px',
        height: '24px',
        minHeight: '0px'
      }
    },
    MuiIconButton: {
      root: {
        minWidth: '0px',
        width: '1em',
        height: '1em'
      }
    },
    MuiSvgIcon: {
      root: {
        fontSize: '18px'
      }
    },
    MuiInput: {
      root: {
        color: '#616161'
      }
    },
    MuiTypography: {
      root: {
        color: '#616161'
      },
      body1: {
        color: '#616161'
      },
      subheading: {
        color: '#616161'
      },
      title: {
        color: '#616161'
      }
    }
  }
});



const App =defaultProps(
  {
    'filterPredicate': filterPredicate(modelMapping),
    'labelProviders': {
      forData: instanceLabelProvider,
      forSchema: schemaLabelProvider
    },
    'imageProvider': imageProvider
  }
)(TreeEditorApp);

const SmartHomerEditorApp = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <App/>
    </MuiThemeProvider>
  )
};

export default SmartHomerEditorApp;
