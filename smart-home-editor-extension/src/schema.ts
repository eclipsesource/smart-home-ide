export default {
  $id: "#appdescription",
  type: "object",
  properties: {
    id: {
      type: "string"
    },
    description: {
      type: "string"
    },
    name: {
      type: "string"
    },
    icon: {
      type: "string"
    },
    author: {
      type: "string"
    },
    bundle: {
      type: "string"
    },
    className: {
      type: "string"
    },
    providedState: {
      type: "array",
      items: {
        $id: "#providedStateItem",
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          description: {
            type: "string"
          },
          name: {
            type: "string"
          },
          multiple: {
            type: "boolean"
          },
          requiresName: {
            type: "boolean"
          },
          type: {
            type: "string",
            enum: [
              "Item",
              "Virtual",
              "Framework"
            ]
          },
          tags: {
            type: "array",
            items: {
              type: "string"
            }
          },
          defaultValueString: {
            type: "string"
          }
        },
        additionalProperties: false,
        required: [
          "id",
          "description",
          "name",
          "multiple",
          "requiresName",
          "type",
          "defaultValueString"
        ]
      }
    },
    requiredStates: {
      type: "array",
      items: {
        $id: "#requiredStatesItem",
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          description: {
            type: "string"
          },
          name: {
            type: "string"
          },
          multiple: {
            type: "boolean"
          },
          requiresName: {
            type: "boolean"
          },
          type: {
            type: "string",
            enum: [
              "Item",
              "Virtual",
              "Framework"
            ]
          },
          tags: {
            type: "array",
            items: {
              type: "string"
            }
          },
          defaultValueString: {
            type: "string"
          }
        },
        additionalProperties: false,
        required: [
          "id",
          "description",
          "name",
          "multiple",
          "requiresName",
          "type",
          "defaultValueString"
        ]
      }
    },
    requiredActors: {
      type: "array",
      items: {
        "$id": "#requiredActor",
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          description: {
            type: "string"
          },
          name: {
            type: "string"
          },
          multiple: {
            type: "boolean"
          },
          requiresName: {
            type: "boolean"
          },
          type: {
            type: "string",
            enum: [
              "Item",
              "Virtual",
              "Framework"
            ]
          },
          tags: {
            type: "array",
            items: {
              type: "string"
            }
          },
          defaultValueString: {
            type: "string"
          }
        },
        additionalProperties: false,
        required: [
          "id",
          "description",
          "name",
          "multiple",
          "requiresName",
          "type",
          "defaultValueString"
        ]
      }
    },
    requiredParameters: {
      type: "array",
      items: {
        "$id": "#requiredParameter",
        type: "object",
        properties: {
          name: {
            type: "string"
          }
        },
        additionalProperties: false,
        required: [
          "name"
        ]
      }
    },
    enabled: {
      type: "boolean"
    }
  },
  additionalProperties: false,
  required: [
    "id",
    "description",
    "name",
    "icon",
    "author",
    "bundle",
    "className",
    "enabled"
  ]
}
