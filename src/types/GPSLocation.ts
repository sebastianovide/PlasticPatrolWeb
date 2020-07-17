export type GPSLocation = {
  online: boolean;
  updated?: Date;
} & LatLong;

export type LatLong = {
  latitude: number;
  longitude: number;
};
