import * as React from 'react';
import * as _ from 'lodash';
import TreeWithDetailRenderer from '@jsonforms/material-tree-renderer/lib/tree/TreeWithDetailRenderer';
import { connect } from 'react-redux';
import {
  TreeEditorProps,
  mapStateToTreeEditorProps
} from 'theia-tree-editor';

class SmartHomeEditor extends React.Component<TreeEditorProps, {}> {
  
  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.rootData, prevProps.rootData)) {
      this.props.saveable.dirty = true;
    }
  }

  render() {
 
    console.log("props", this.props);

    return (
      <TreeWithDetailRenderer {...this.props} />
    );
  }
}

export default connect(mapStateToTreeEditorProps)(SmartHomeEditor);
