import { LatLong } from "types/GPSLocation";

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

export type RawData = Partial<BrowserState | CordovaState>;

export type ImageMetadata = {
  imgSrc: string | undefined;
  imgExif: any;
  imgLocation: LatLong | undefined;
  imgIptc: any;
};

export type State = {
  rawData: RawData;
  processedData: ImageMetadata;
};

export type Action = { type: string; payload?: any };

export function isInitialState(rawData: RawData) {
  return rawData.file === undefined;
}

export function isCordovaImageState(rawData: RawData): rawData is CordovaState {
  return isCordovaCameraImage(rawData.file);
}

export function isBrowserImageState(state: State): state is BrowserState {
  return state.isCordovaImage === true;
}
