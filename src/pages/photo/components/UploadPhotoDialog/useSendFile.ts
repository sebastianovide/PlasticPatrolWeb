import { useState } from "react";
import { useHistory } from "react-router-dom";

import firebase from "firebase/app";

import { dbFirebase } from "features/firebase";
import { gtagEvent } from "gtag.js";
import { Item } from "pages/photo/types";

import { linkToUploadSuccess } from "routes/upload-success/links";
import useEffectOnMount from "hooks/useEffectOnMount";

type Args = {
  imgSrc: string;
  online?: boolean;
  imgLocation: any;
  items: Item[];
  setUploadTask: (task: any) => void;
  onSuccess?: (n: number) => void;
};

export default function useSendFile(args: Args) {
  const [errorMessage, setErrorMessage] = useState<string>();

  const sendFileFunc = async () => {
    try {
      await sendFile({ ...args });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  useEffectOnMount(sendFileFunc);

  return {
    sendFile: sendFileFunc,
    errorMessage,
    closeErrorDialog: () => setErrorMessage(undefined)
  };
}

async function sendFile({
  imgSrc,
  online,
  imgLocation,
  items,
  setUploadTask
}: Args) {
  if (!online) {
    throw new Error(
      "It appears you're offline, please turn on your data or wifi to upload this photo"
    );
  }

  gtagEvent("Upload", "Photo");

  let totalCount: number = 0;
  const transformedItems = items.map(({ quantity, type, brand }) => {
    totalCount = totalCount + quantity;
    return {
      brand,
      number: quantity,
      leafkey: type && type.leafKey,
      label: type && type.label
    };
  });

  const dataToSend = {
    ...imgLocation,
    pieces: totalCount,
    categories: transformedItems
  };

  let photoRef;
  try {
    photoRef = await dbFirebase.saveMetadata(dataToSend);
  } catch (error) {
    console.error(error);

    // debugger
    const extraInfo =
      error.message === "storage/canceled"
        ? ""
        : `Try again (${error.message})`;
    throw new Error(`Photo upload was canceled. ${extraInfo}`);
  }

  const base64 = imgSrc.split(",")[1];
  const uploadTask = dbFirebase.savePhoto(photoRef.id, base64);

  setUploadTask(uploadTask);
}
