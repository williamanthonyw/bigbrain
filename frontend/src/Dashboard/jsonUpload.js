import Ajv from "ajv";

export default function verifyJSON(jsonString) {
  try {
    const json = JSON.parse(jsonString);
    const isValidSchema = validateJSONSchema(json);
    return isValidSchema;
  } catch (e) {
    console.error("Invalid JSON string:", e);
    return false;
  }
}

function validateJSONSchema(parsedJSON) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(parsedJSON);
  if (valid) {
    return true;
  } else {
    console.error("JSON schema validation errors:", validate.errors);
    return false;
  }
}

const schema = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
      },
      "title": {
        "type": "string"
      },
      "duration": {
        "type": "integer",
      },
      "points": {
        "type": "integer",
      },
      "media": {
        "type": "string",
      },
      "correctAnswers": {
        "type": "array",
        "items": {
          "type": "string",
        },
        "minItems": 1,
        "maxItems": 6
      },
      "type": {
        "type": "string",
        "enum": ["single", "multiple", "judgement"]
      },
      "answers": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "minItems": 2,
        "maxItems": 6
      }
    },
    "required": [
      "id",
      "title",
      "duration",
      "points",
      "media",
      "correctAnswers",
      "type",
      "answers"
    ]
  }
}