import loadImage from "blueimp-load-image";
import dms2dec from "dms2dec";

import config from "custom/config";

import { device } from "utils";
import { GPSLocation } from "types/GPSLocation";

type Args = {
  photoToLoad: File;
  srcType: string;
  gpsLocation: GPSLocation;
  cordovaMetaData: any;
  callback: (result: any) => void;
};
export default function loadPhoto({
  photoToLoad,
  srcType,
  gpsLocation,
  cordovaMetaData,
  callback
}: Args) {
  let imgExif: any = null;
  let imgIptc: any = null;
  let imgLocation: any = null;

  //   https://github.com/blueimp/JavaScript-Load-Image#meta-data-parsing
  //@ts-ignore
  if (!window.cordova) {
    loadImage.parseMetaData(
      photoToLoad,
      data => {
        //@ts-ignore
        imgExif = data.exif ? data.exif.getAll() : imgExif;
        //@ts-ignore
        imgIptc = data.iptc ? data.iptc.getAll() : imgIptc;
      },
      {
        maxMetaDataSize: 262144,
        disableImageHead: false
      }
    );
  }

  return loadImage(
    photoToLoad,
    img => {
      let imgFromCamera;

      // @ts-ignore
      const imgSrc = img.toDataURL("image/jpeg");
      // @ts-ignore
      if (window.cordova) {
        if (srcType === "camera") {
          imgFromCamera = true;
        } else {
          imgFromCamera = false;
        }
      } else {
        const fileDate = photoToLoad.lastModified;
        const ageInMinutes = (new Date().getTime() - fileDate) / 1000 / 60;
        imgFromCamera = isNaN(ageInMinutes) || ageInMinutes < 0.5;
      }

      if (imgFromCamera) {
        imgLocation = gpsLocation;
        if (!gpsLocation.online) {
          throw new Error(
            "We couldn't find your location so you won't be able to upload an image right now. Enable GPS on your phone and retake the photo to upload it."
          );
        }
      } else {
        // imgLocation = getLocationFromExifMetadata(imgExif, cordovaMetaData);
      }

      callback({
        imgSrc,
        imgExif,
        imgIptc,
        imgLocation
      });
    },
    {
      orientation: true,
      maxWidth: config.MAX_IMAGE_SIZE,
      maxHeight: config.MAX_IMAGE_SIZE
    }
  );
}

function getLocationFromExifMetadata(imgExif: any, cordovaMetadata: any) {
  let latitude: number, longitude: number;
  try {
    //@ts-ignore
    if (!window.cordova) {
      console.log(imgExif);
      // https://www.npmjs.com/package/dms2dec
      const lat = imgExif.GPSLatitude.split(",").map(Number);
      const latRef = imgExif.GPSLatitudeRef;
      const lon = imgExif.GPSLongitude.split(",").map(Number);
      const lonRef = imgExif.GPSLongitudeRef;
      const latLon = dms2dec(lat, latRef, lon, lonRef);
      latitude = latLon[0];
      longitude = latLon[1];

      return { latitude, longitude };
    } else {
      if (device() === "iOS") {
        const iosGPSMetadata = cordovaMetadata.GPS;
        const latRef = iosGPSMetadata.LatitudeRef;
        const lonRef = iosGPSMetadata.LongitudeRef;
        const Latitude = iosGPSMetadata.Latitude;
        const Longitude = iosGPSMetadata.Longitude;
        latitude = latRef === "N" ? Latitude : -Latitude;
        longitude = lonRef === "E" ? Longitude : -Longitude;
        return { latitude, longitude };
      } else if (device() === "Android") {
        const androidMetadata = cordovaMetadata;
        const lat = androidMetadata.gpsLatitude;
        const latRef = androidMetadata.gpsLatitudeRef;
        const lon = androidMetadata.gpsLongitude;
        const lonRef = androidMetadata.gpsLongitudeRef;
        const latLon = dms2dec(lat, latRef, lon, lonRef);
        latitude = latLon[0];
        longitude = latLon[1];
        return {
          latitude,
          longitude
        };
      }
    }
  } catch (e) {
    throw new Error(`Error extracting GPS from file; ${e}`);
  }
}
