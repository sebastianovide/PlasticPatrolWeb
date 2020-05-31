import React, { useState, useContext, useEffect } from "react";
import { GPSLocation } from "types/GPSLocation";

const LocationContext = React.createContext<GPSLocation | undefined>(undefined);

const LocationProvider: React.FC<{}> = ({ children }) => {
  const [location, setLocation] = useState<GPSLocation | undefined>();

  useEffect(() => {
    if (!navigator || !navigator.geolocation) {
      return;
    }
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
          if (currentLocation) {
            return {
              ...currentLocation,
              online: false
            };
          }
        });
      }
    );
    return () => navigator.geolocation.clearWatch(subscription);
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};

export const useGPSLocation = () => useContext(LocationContext);

export default LocationProvider;
