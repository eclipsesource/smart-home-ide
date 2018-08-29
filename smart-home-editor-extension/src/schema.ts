export default {

  definitions: {
    // STATE
    state: {
      $id: "#state",
      type: "object",
      properties: {
        id: { type: "string" },
        description: { type: "string" },
        name: { type: "string" },
        multiple: { type: "boolean" },
        requiresName: { type: "boolean" },
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
        defaultValueString: { type: "string" },
        defaultValue: { type: "object" },
        eClass: {
          type: "string",
          enum: [
            "http://eclipsesource.com/smarthome/core/model/appdescription#//BooleanState",
            "http://eclipsesource.com/smarthome/core/model/appdescription#//DateTimeState",
            "http://eclipsesource.com/smarthome/core/model/appdescription#//NumberState"
          ]
        }
      },
      required: ["id", "description", "name", "multiple", "requiresName", "tags", "eClass"]
    },

    // CONCRETE STATES
    booleanState: {
      $id: "#booleanState",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/state" }
      ]
    },
    dateTimeState: {
      $id: "#dateTimeState",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/state" }
      ]
    },
    numberState: {
      $id: "#numberState",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/state" }
      ]
    },

    //CONCRETE ACTORS
    actor: {
      $id: "#actor",
      type: "object",
      properties: {
        id: { type: "string" },
        description: { type: "string" },
        name: { type: "string" },
        multiple: { type: "boolean" },
        requiresName: { type: "boolean" },
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
        defaultValueString: { type: "string" },
        defaultValue: { type: "object" },
        eClass: {
          type: "string",
          enum: [
            "http://eclipsesource.com/smarthome/core/model/appdescription#//HeatingActor",
            "http://eclipsesource.com/smarthome/core/model/appdescription#//LockUnlockActor",
            "http://eclipsesource.com/smarthome/core/model/appdescription#//OnOffActor",
            "http://eclipsesource.com/smarthome/core/model/appdescription#//PlayPauseActor"
          ]
        }
      },
      required: ["id", "description", "name", "multiple", "requiresName", "tags", "eClass"]
    },
    heatingActor: {
      $id: "#heatingActor",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/actor" }
      ]
    },
    lockUnlockActor: {
      $id: "#lockUnlockActor",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/actor" }
      ]
    },
    onOffActor: {
      $id: "#onOffActor",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/actor" }
      ]
    },
    playPauseActor: {
      $id: "#playPauseActor",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/actor" }
      ]
    },

    // PARAMETERS
    parameter: {
      $id: "#parameter",
      type: "object",
      properties: {
        name: { type: "string" },
        eClass: {
          type: "string",
          enum: [
            "http://eclipsesource.com/smarthome/core/model/appdescription#//BooleanParameter",
            "http://eclipsesource.com/smarthome/core/model/appdescription#//DateTimeParameter",
            "http://eclipsesource.com/smarthome/core/model/appdescription#//NumberParameter"
          ]
        }
      },
      required: ["name", "eClass"]
    },

    // CONCRETE PARAMETERS
    booleanParameter: {
      $id: "#booleanParameter",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/parameter" }
      ]
    },
    dateTimeParameter: {
      $id: "#dateTimeParameter",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/parameter" }
      ]
    },
    numberParameter: {
      $id: "#numberParameter",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/parameter" }
      ]
    }
  },

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
        anyOf: [
          { $ref: "#/definitions/booleanState" },
          { $ref: "#/definitions/dateTimeState" },
          { $ref: "#/definitions/numberState" }
        ]
      }
    },

    // required state with 
    requiredStates: {
      type: "array",
      items: {
        anyOf: [
          { $ref: "#/definitions/booleanState" },
          { $ref: "#/definitions/dateTimeState" },
          { $ref: "#/definitions/numberState" }
        ]
      }
    },
    requiredActors: {
      type: "array",
      items: {
        anyOf: [
          { $ref: "#/definitions/heatingActor" },
          { $ref: "#/definitions/lockUnlockActor" },
          { $ref: "#/definitions/onOffActor" },
          { $ref: "#/definitions/playPauseActor" }
        ]
      }
    },
    requiredParameters: {
      type: "array",
      items: {
        anyOf: [
          { $ref: "#/definitions/booleanParameter" },
          { $ref: "#/definitions/dateTimeParameter" },
          { $ref: "#/definitions/numberParameter" }
        ]
      }
    },
    enabled: {
      type: "boolean"
    },
    eClass: {
      type: "string",
      enum: [
        "http://eclipsesource.com/smarthome/core/model/appdescription#//App"
      ]
      // TODO use const instead of enum when we are able to preset this to newly created elements
      // const: "http://eclipsesource.com/smarthome/core/model/appdescription#//App"
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
