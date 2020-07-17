import { OrderedMap } from "immutable";
import { useState, useEffect } from "react";
import { dbFirebase } from "features/firebase";
import Photo from "types/Photo";
import config from "custom/config";

const usePhotosToModerate = (): Photo[] => {
  const [toModerate, setToModerate] = useState(OrderedMap<string, Photo>());
  useEffect(
    () =>
      dbFirebase.photosToModerateRT(
        config.MODERATING_PHOTOS,
        (photo) => {
          setToModerate((x) => x.set(photo.id, photo));
        },
        (photo: Photo) => setToModerate((x) => x.remove(photo.id))
      ),
    []
  );
  return Array.from(toModerate.values());
};

export default usePhotosToModerate;
