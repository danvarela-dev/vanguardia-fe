export interface Response {
  kind: string;
  result: Result;
}

export interface Result {
  query: string;
  prediction: Prediction;
}

export interface Prediction {
  topIntent: string;
  projectKind: string;
  intents: Intent[];
  entities: Entity[];
}

export interface Intent {
  category: string;
  confidenceScore: number;
}

export interface Entity {
  category: string;
  text: string;
  offset: number;
  length: number;
  confidenceScore: number;
}
