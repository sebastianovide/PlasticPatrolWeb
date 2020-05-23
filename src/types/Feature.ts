import Photo from "./Photo";

type Coordinates = [number, number];

type Geometry = {
  type: "Point";
  coordinates: Coordinates;
};

type Feature = {
  feature: "Feature";
  geometry: Geometry;
  properties: Photo;
};

export default Feature;
