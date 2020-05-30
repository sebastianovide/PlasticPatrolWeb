import { LatLong } from "types/GPSLocation";

type Photo = {
  id: any;
  main: any;
  thumbnail: any;
  updated: any;
  moderated: any;
  owner_id: string;
  pieces: number;
};

export type ImageMetadata = {
  imgSrc: any;
  imgExif: any;
  imgLocation: LatLong | undefined;
  imgIptc: any;
};

export default Photo;
