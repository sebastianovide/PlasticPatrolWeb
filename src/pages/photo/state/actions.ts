import actionTypes from "./actionTypes";
import { FileType } from "./types";

type SetFile = {
  fromCamera: boolean;
  file: FileType;
};

export function setFile({ file, fromCamera }: SetFile) {
  return {
    type: actionTypes.SET_FILE,
    payload: {
      file,
      fromCamera
    }
  };
}
