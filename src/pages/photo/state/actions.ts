import actionTypes from "./actionTypes";
import { RawData, ImageMetadata } from "./types";

export function setRawData(payload: RawData) {
  return {
    type: actionTypes.SET_RAW_DATA,
    payload
  };
}

export function setProcessedData(payload: ImageMetadata) {
  return {
    type: actionTypes.SET_PROCESSED_DATA,
    payload
  };
}
