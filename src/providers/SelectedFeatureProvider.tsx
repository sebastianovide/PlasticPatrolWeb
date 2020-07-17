import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { gtagPageView } from "gtag";

import { dbFirebase } from "features/firebase";
import Feature from "types/Feature";

import useAsyncEffect from "hooks/useAsyncEffect";

import { extractPathnameParams } from "./PhotosProvider";

const SelectedFeatureContext = React.createContext<Feature | undefined>(
  undefined
);

type Props = { children: React.ElementType };

export default function SelectedFeatureProvider({ children }: Props) {
  const [selectedFeature, setSelectedFeature] = useState<Feature | undefined>();
  const location = useLocation();
  useEffect(() => {
    gtagPageView(location.pathname);
  }, [location]);
  const { photoId } = extractPathnameParams(location);
  useAsyncEffect(async () => {
    if (photoId) {
      const photo = await dbFirebase.getPhotoByID(photoId);
      setSelectedFeature(photo);
    }
  }, [photoId]);

  return (
    <SelectedFeatureContext.Provider value={selectedFeature}>
      {children}
    </SelectedFeatureContext.Provider>
  );
}

export const useSelectedFeature = () => useContext(SelectedFeatureContext);
