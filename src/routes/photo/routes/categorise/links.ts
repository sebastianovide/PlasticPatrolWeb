import { linkToPhotoPage } from "routes/photo/links";
import { useLocation } from "react-router-dom";

export function linkToCategorise(fileName: string = ":fileName") {
  return `${linkToPhotoPage()}/categorise/${fileName}`;
}

export function linkToCategoriseWithState(file: File | string) {
  if (typeof file === "string") {
    return {
      pathname: linkToCategorise("cordova"),
      state: { encodedFile: file }
    };
  }

  const fileName = file.name;
  return { pathname: linkToCategorise(fileName), state: { file } };
}

export function getLocationFileState(location: any) {
  if (!location.state) {
    console.error("No location state");
    return;
  }

  if (location.state.encodedFile) {
    const file = JSON.parse(location.state.encodedFile);
    const cordovaMetaData = JSON.parse(file.json_metadata);

    return { file, cordovaMetaData };
  }

  return { file: location.state.file };
}

export function useGetLocationFileState() {
  const location = useLocation();

  return getLocationFileState(location);
}

export function linkToUploadPhoto(fileName?: string) {
  return `${linkToCategorise(fileName)}/upload`;
}
