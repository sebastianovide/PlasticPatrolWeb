import React, { useState, useContext, useEffect } from "react";
import { GPSLocation } from "types/GPSLocation";
import config from "custom/config";
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

const LocationContext = React.createContext<GPSLocation | undefined>(undefined);

const LocationProvider: React.FC<{}> = ({ children }) => {
  const [location, setLocation] = useState<GPSLocation>({
    latitude: config.CENTER[1],
    longitude: config.CENTER[0],
    online: false,
    updated: undefined
  });

  console.log("LOCATION PROVIDER")


  useEffect(() => {
    console.log("LOCATION PROVIDER useEffect")

    // TODO: remove with cordova
    if (!Geolocation.watchPosition) {
      console.log("CORDOVA VERSION")

      if (!navigator?.geolocation?.watchPosition) { return }
      const subscription = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            online: true,
            updated: new Date(position.timestamp) // it indicate the freshness of the location.
          });
        },
        (error) => {
          console.log("Error: ", error.message);

          setLocation((currentLocation) => {
            return {
              ...currentLocation,
              online: false
            };
          });
        }
      );

      return () => navigator.geolocation.clearWatch(subscription);
    } else {
      console.log("CAPACITOR VERSION")

      const watcherId = Geolocation.watchPosition({}, (position, error) => { 
        if (!error) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            online: true,
            updated: new Date(position.timestamp)
          });
        } else {
          console.log("Error: ", error.message);

          setLocation((currentLocation) => {
            return {
              ...currentLocation,
              online: false
            };
          });
        }
      });

      return () => Geolocation.clearWatch({id:watcherId});
    }

  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};

export const useGPSLocation = () => useContext(LocationContext);

export default LocationProvider;
