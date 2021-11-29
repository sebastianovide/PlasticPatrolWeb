import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import firebase from "firebase/app";

import { dbFirebase } from "features/firebase";
import { gtagEvent } from "gtag.js";
import { Item, CategoryJson } from "pages/photo/types";

import { linkToUploadSuccess } from "routes/upload-success/links";
import useEffectOnMount from "hooks/useEffectOnMount";

import { useUser } from "../../../../providers/UserProvider";
import { updateMissionOnPhotoUploaded } from "../../../../features/firebase/missions";
import { useMissions } from "../../../../providers/MissionsProvider";

import categories from "custom/categories.json";

type HookArgs = {
  imgSrc: string;
  online?: boolean;
  imgLocation: any;
  items: Item[];
  onSuccess?: (n: number) => void;
};

type Args = {
  uploaderId: string;
  setSendingProgress: (progress: number) => void;
  setUploadTask: (task: any) => void;
  history: any;
  missionIds: string[];
} & HookArgs;

export default function useSendFile(args: HookArgs) {
  const [uploadTask, setUploadTask] = useState<any>();
  const [sendingProgress, setSendingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();

  const history = useHistory();
  const missionData = useMissions();
  const user = useUser();
  const { t } = useTranslation();

  const missionIds = user?.missions || [];
  const uploaderId = user?.id || "";

  const sendFileFunc = async () => {
    try {
      await sendFile({
        ...args,
        uploaderId,
        setUploadTask,
        setSendingProgress,
        history,
        missionIds
      });
      await missionData?.refresh();
    } catch (err) {
      setErrorMessage(t(err.message));
    }
  };
  const cancelUpload = () => {
    uploadTask && uploadTask.cancel();
    history.goBack();
  };

  useEffectOnMount(sendFileFunc);

  return {
    sendFile: sendFileFunc,
    sendingProgress,
    cancelUpload,
    errorMessage,
    closeErrorDialog: () => {
      cancelUpload();
      setErrorMessage(undefined);
    }
  };
}

async function sendFile({
  uploaderId,
  imgSrc,
  online,
  imgLocation,
  items,
  history,
  setSendingProgress,
  setUploadTask,
  missionIds
}: Args) {
  if (!online) {
    throw new Error("record_litter_offline_text");
  }

  gtagEvent("Upload", "Photo");

  const categoryJson = categories as CategoryJson;
  let totalCount: number = 0;
  const transformedItems = items.map(
    ({ quantity, category, brand, barcode }) => {
      totalCount = totalCount + quantity;
      return {
        brand: brand.label,
        brandId: brand.id,
        barcode: barcode || null,
        number: quantity,
        label: barcode || !category.id ? category.label : categoryJson[category.id!].label,
        categoryId: category.id,
        // legacy
        leafkey: category.id
      };
    }
  );

  const dataToSend = {
    ...imgLocation,
    pieces: totalCount,
    categories: transformedItems,
    missions: missionIds
  };

  let photoRef = await dbFirebase.saveMetadata(dataToSend);

  try {
    await updateMissionOnPhotoUploaded(uploaderId, totalCount, missionIds);
  } catch (error) {
    console.error(error);
  }

  const base64 = imgSrc.split(",")[1];
  const uploadTask = dbFirebase.savePhoto(photoRef.id, base64);

  setUploadTask(uploadTask);

  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
    const sendingProgress = Math.ceil(
      (snapshot.bytesTransferred / snapshot.totalBytes) * 98 + 1
    );
    setSendingProgress(sendingProgress);

    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log("Upload is paused");
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log("Upload is running");
        break;
      default:
        console.log(snapshot.state);
    }
  });

  await uploadTask.then(() => {
    history.push(linkToUploadSuccess(missionIds.length > 0));
  });
}
