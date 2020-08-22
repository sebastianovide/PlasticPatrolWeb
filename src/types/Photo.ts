import { LatLong } from "types/GPSLocation";
import { Map } from "immutable";
import Geojson from "./Geojson";
import Feature from "./Feature";
import { Category } from "./Category";

type Photo = {
  id: any;
  main: any;
  thumbnail: any;
  updated: Date;
  moderated?: Date;
  owner_id: string;
  pieces: number;
  location: firebase.firestore.GeoPoint;
  published: boolean;
  categories: Category[];
};

export type PhotosContainer = {
  geojson: Geojson;
  featuresDict: Map<string, Feature>;
};

export type ImageMetadata = {
  imgSrc: any;
  imgExif: any;
  imgLocation: LatLong | "not online" | "unable to extract from file";
  imgIptc: any;
};

export default Photo;
