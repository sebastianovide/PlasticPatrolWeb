export type CordovaCameraImage = {
  filename: string;
  json_metadata: string;
};

export type AndroidCordovaMetaData = {
  gpsLatitude: string;
  gpsLatitudeRef: string;
  gpsLongitude: string;
  gpsLongitudeRef: string;
};

export type iosCordovaMetaData = {
  GPS: {
    LatitudeRef: string;
    LongitudeRef: string;
    Latitude: number;
    Longitude: number;
  };
};

export type CordovaMetaData = AndroidCordovaMetaData | iosCordovaMetaData;

export function isCordovaCameraImage(file: any): file is CordovaCameraImage {
  return file && file.filename !== undefined;
}

export type FileType = File | CordovaCameraImage;

export type BrowserState = {
  isCordovaImage: false;
  fromCamera: boolean;
  file: File;
};

export type CordovaState = {
  isCordovaImage: true;
  fromCamera: boolean;
  file: CordovaCameraImage;
};

export type State = Partial<BrowserState | CordovaState>;

export type Action = { type: string; payload: any };

export function isCordovaImageState(state: State): state is CordovaState {
  return isCordovaCameraImage(state.file);
}

export function isBrowserImageState(state: State): state is BrowserState {
  return state.isCordovaImage === false;
}
