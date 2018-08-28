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
        defaultValue: { type: "object" }
      },
      required: ["id", "description", "name", "multiple", "requiresName", "type", "tags", "defaultValueString", "defaultValue"]
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
    heatingActor: {
      $id: "#heatingActor",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/state" }
      ]
    },
    lockUnlockActor: {
      $id: "#lockUnlockActor",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/state" }
      ]
    },
    onOffActor: {
      $id: "#onOffActor",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/state" }
      ]
    },
    playPauseActor: {
      $id: "#playPauseActor",
      type: "object",
      anyOf: [
        { $ref: "#/definitions/state" }
      ]
    },

    // PARAMETERS
    parameter: {
      $id: "#parameter",
      type: "object",
      properties: {
        name: { type: "string" }
      },
      required: ["name"]
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
