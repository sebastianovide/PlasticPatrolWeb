import { LatLong } from "./GPSLocation";

export type Feedback = {
  appVersion: string;
  buildNumber: string;
  created: { seconds: number; nanoseconds: number; toDate: () => Object };
  device: string;
  email: string;
  feedback: string;
  location: LatLong;
  resolved: boolean;
  updated: { seconds: number; nanoseconds: number; toDate: () => Object };
  userAgent: string;
  id: string;
};
