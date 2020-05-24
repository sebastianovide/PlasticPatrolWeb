import Feature from "types/Feature";

type Geojson = {
  type: "FeatureCollection";
  features: Feature[];
};

export default Geojson;
