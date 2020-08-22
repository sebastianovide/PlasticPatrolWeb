import actionTypes from "./actionTypes";
import { FileType } from "./types";

type SetRawData = {
  fromCamera: boolean;
  file: FileType;
};

export function setRawData({ file, fromCamera }: SetRawData) {
  return {
    type: actionTypes.SET_RAW_DATA,
    payload: {
      file,
      fromCamera
    }
  };
}
