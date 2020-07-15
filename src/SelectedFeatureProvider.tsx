// TODO make this into an actual provider so we can use it at arbitrary
// depths in the tree?
import { useState, useEffect } from "react";
import { dbFirebase } from "features/firebase";
import Feature from "types/Feature";
import { useLocation } from "react-router-dom";
import { extractPathnameParams } from "PhotosProvider";
import useAsyncEffect from "hooks/useAsyncEffect";
import { gtagPageView } from "gtag";

export const useSelectedFeature = () => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | undefined>();
  const location = useLocation();
  useEffect(() => {
    gtagPageView(location.pathname);
  }, [location]);
  useAsyncEffect(async () => {
    const { photoId } = extractPathnameParams(location);
    if (photoId) {
      const photo = await dbFirebase.getPhotoByID(photoId);
      setSelectedFeature(photo);
    }
  }, [location]);
  return selectedFeature;
};
