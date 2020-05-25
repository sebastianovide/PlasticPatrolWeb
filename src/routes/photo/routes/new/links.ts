import { linkToPhotoPage } from "../../links";

export function linkToNewPhoto() {
  return `${linkToPhotoPage()}/new`;
}

export function linkToAddDialog() {
  return `${linkToNewPhoto()}/add`;
}
