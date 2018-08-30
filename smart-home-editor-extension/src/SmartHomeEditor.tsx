import * as React from 'react';
import * as _ from 'lodash';
import TreeWithDetailRenderer from '@jsonforms/material-tree-renderer/lib/tree/TreeWithDetailRenderer';
import { connect } from 'react-redux'; 
import {
  TreeEditorProps,
  mapStateToTreeEditorProps,
  ResourceSaveable,
} from 'theia-tree-editor';

interface SmartHomeEditorProps extends TreeEditorProps {
  saveable: ResourceSaveable
}

class SmartHomeEditor extends React.Component<SmartHomeEditorProps, {}> {
  
  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.rootData, prevProps.rootData)) {
      console.log('dirty', this.props.saveable.dirty);
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
