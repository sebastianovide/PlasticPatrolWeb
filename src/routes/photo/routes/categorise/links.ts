import { linkToPhotoPage } from "routes/photo/links";
import { useLocation } from "react-router-dom";
import {
  FileState,
  CordovaCameraImage,
  isCordovaCameraImage
} from "types/Photo";

export function linkToCategorise(fileName: string = ":fileName") {
  return `${linkToPhotoPage()}/categorise/${fileName}`;
}

export function linkToCategoriseWithState(
  file: File | CordovaCameraImage,
  fromCamera: boolean
) {
  if (isCordovaCameraImage(file)) {
    return {
      pathname: linkToCategorise("cordova"),
      state: { cordovaImage: file, fromCamera }
    };
  }

  return { pathname: linkToCategorise(file.name), state: { file, fromCamera } };
}

export function getLocationFileState(location: any): FileState | undefined {
  if (!location.state) {
    console.error("No location state");
    return;
  }

  if (location.state.cordovaImage) {
    const image: CordovaCameraImage = location.state.cordovaImage;
    const { filename, json_metadata } = image;
    return {
      filePath: filename as string,
      cordovaMetadata: JSON.parse(json_metadata as string),
      fromCamera: location.state.fromCamera as boolean
    };
  }

  return { file: location.state.file, fromCamera: location.state.fromCamera };
}

export function useGetLocationFileState(): FileState | undefined {
  const location = useLocation();

  return getLocationFileState(location);
}

export function linkToUploadPhotoDialog() {
  return `${linkToCategorise()}/upload`;
}
