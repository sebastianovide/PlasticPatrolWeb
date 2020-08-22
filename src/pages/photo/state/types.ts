import { LatLong } from "types/GPSLocation";

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

export type RawData = InitialState | BrowserState | CordovaState;

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

export function isInitialState(rawData: RawData): rawData is InitialState {
  return rawData.file === undefined;
}

export function isCordovaImageState(rawData: RawData): rawData is CordovaState {
  return isCordovaCameraImage(rawData.file);
}
