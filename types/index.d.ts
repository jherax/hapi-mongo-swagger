declare type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | {[key: string]: JSONValue};

declare interface JSONObject {
  [k: string]: JSONValue;
}

declare type JSONArray = Array<JSONValue>;

declare type ServerMessage = {
  statusCode: number;
  message: string;
  success: boolean;
};

declare interface ServerResponse<T = JSONObject> extends ServerMessage {
  data?: T;
  error?: {
    message: string;
    stack: string;
  };
}
