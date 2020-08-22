export type CordovaCameraImage = {
  filename: string;
  json_metadata: string;
};

export function isCordovaCameraImage(file: any): file is CordovaCameraImage {
  return file && file.filename !== undefined;
}

export type FileType = File | CordovaCameraImage;

export type InitialState = {
  fromCamera: undefined;
  file: undefined;
};

export type BrowserState = {
  fromCamera: boolean;
  file: File;
};

export type CordovaState = {
  fromCamera: boolean;
  file: CordovaCameraImage;
};

export type State = InitialState | BrowserState | CordovaState;

export type Action = { type: string; payload: any };

export function isInitialState(state: State): state is InitialState {
  return state.file === undefined;
}

export function isCordovaImageState(state: State): state is CordovaState {
  return isCordovaCameraImage(state.file);
}
