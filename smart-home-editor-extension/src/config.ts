export const labels = {
	"#appdescription": {
		constant: "App Description"
	},
	"#providedStateItem": {
		constant: "Provided State",
  },
  "#requiredStatesItem" : {
		constant: "Required State",
  },
	"#requiredActor": {
		constant: "Required Actors"
	},
	"#requiredParameter": {
		constant: "Required Parameters",
	}
}

export const modelMapping = {
	attribute: 'type',
 	mapping: {
    appdescription: '#appdescription',
    requiredStatesItem: '#requiredStatesItem',
		providedStateItem: '#providedStateItem',
		requiredActor: '#requiredActors',
		requiredParameter: '#requiredParameters'
 	}	
};

export const uischemas = {
  '#appdescription': {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/id'
      },
      {
        type: 'Control',
        scope: '#/properties/name'
      },
      {
        type: 'Control',
        scope: '#/properties/description'
      },
      {
        type: 'Control',
        scope: '#/properties/icon'
      },
      {
        type: 'Control',
        scope: '#/properties/author'
      },
      {
        type: 'Control',
        scope: '#/properties/bundle'
      },
      {
        type: 'Control',
        scope: '#/properties/className'
      },
      {
        type: 'Control',
        label: "Do enable?",
	scope: '#/properties/enabled'
      }
    ]
  },
  '#providedStateItem': {
    type: 'VerticalLayout',
    elements: [{
      type: 'Control',
      scope: '#/properties/name'
    }, {
      type: 'Control',
      scope: '#/properties/description'
    }, {
      type: 'Control',
      scope: '#/properties/multiple'
    }, {
      type: 'Control',
      scope: '#/properties/enabled'
    }]
  },
  '#requiredParameter': {
    type: 'VerticalLayout',
    elements: [{
      type: 'Control',
      scope: '#/properties/name'
    }, {
      type: 'Control',
      scope: '#/properties/description'
    }]
  },
  '#requiredActor': {
    type: 'VerticalLayout',
    elements: [{
      type: 'Control',
      scope: '#/properties/name'
    }, {
      type: 'Control',
      scope: '#/properties/description'
    }]
  }
};
