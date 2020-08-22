import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router";

import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import { linkToUploadPhotoDialog } from "routes/photo/routes/categorise/links";
import { linkToNewPhoto } from "routes/photo/routes/new/links";
import { linkToGeotag } from "routes/photo/routes/geotag/links";

import { useGPSLocation } from "providers/LocationProvider";

import UploadPhotoDialog from "pages/photo/components/UploadPhotoDialog";
import { usePhotoPageState } from "pages/photo/state";
import { isCordovaImageState, isInitialState } from "pages/photo/state/types";

import useEffectOnMount from "hooks/useEffectOnMount";

import { ImageMetadata } from "types/Photo";

import { Item } from "../../types";
import AddNewItem from "../../components/AddNewItem/AddNewItem";
import ItemOverviewList from "../../components/ItemOverviewList/ItemOverviewList";

import loadPhoto from "./utils";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(1),
    boxSizing: "border-box"
  },
  img: {
    minHeight: "50%",
    height: "50%",
    width: "100%",
    alignSelf: "center",
    marginBottom: theme.spacing(1)
  },
  prompt: { textAlign: "center" },
  button: {
    minHeight: "2em",
    marginTop: "auto",
    textTransform: "none",
    width: "max-content",
    alignSelf: "center",
    padding: `${theme.spacing(0.25)}px ${theme.spacing(4)}px`
  },
  link: {
    color: theme.palette.secondary.main
  }
}));

export default function CategoriseLitterPage() {
  const fileState = usePhotoPageState();
  const history = useHistory();
  const gpsLocation = useGPSLocation();

  const [photo, setPhoto] = useState<ImageMetadata | undefined>();
  useEffectOnMount(() => {
    if (isInitialState(fileState)) {
      history.push(linkToNewPhoto());
    } else if (isCordovaImageState(fileState)) {
      const { file, fromCamera } = fileState;
      loadPhoto({
        fileOrFileName: file.filename,
        fromCamera,
        gpsLocation,
        cordovaMetadata: JSON.parse(file.json_metadata),
        callback: (metadata) => {
          setPhoto(metadata);
        }
      });
    } else {
      const { file, fromCamera } = fileState;
      loadPhoto({
        fileOrFileName: file,
        fromCamera,
        gpsLocation,
        callback: (meta) => setPhoto(meta)
      });
    }
  });

  return <CategoriseLitterPageWithFileInfo photo={photo} />;
}

export function CategoriseLitterPageWithFileInfo({
  photo
}: {
  photo?: ImageMetadata;
}) {
  const history = useHistory();

  useEffect(() => {
    if (
      photo &&
      (photo.imgLocation === "not online" ||
        photo.imgLocation === "unable to extract from file")
    ) {
      history.replace(linkToGeotag());
    }
  }, [photo, history]);

  const styles = useStyles();
  const [addingNewItem, setAddingNewItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, itemIndex) => itemIndex !== index);

    setItems(newItems);
  };

  const addNewItem = (item: Item) => {
    const newItems = [...items, item];
    setItems(newItems);
    setAddingNewItem(false);
    setEditingItem(null);
  };

  const handleEditItemClick = (index: number) => {
    const itemToEdit = items[index];
    setEditingItem(itemToEdit);
  };

  const editItem = (item: Item) => {
    const index = editingItem && items.indexOf(editingItem);
    // if item doesn't exist returns -1, in theory shouldn't ever happen
    if (index !== null && index !== -1) {
      const newItems = items;
      newItems[index] = item;
      setItems(newItems);
      setEditingItem(null);
    } else {
      throw new Error("no item to edit");
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <img
          src={photo && photo.imgSrc}
          className={styles.img}
          onClick={() => setAddingNewItem(true)}
          alt=""
        ></img>
        {addingNewItem ? (
          <AddNewItem
            onCancelClick={() => setAddingNewItem(false)}
            onConfirmClick={addNewItem}
          />
        ) : editingItem ? (
          <AddNewItem
            onCancelClick={() => setEditingItem(null)}
            onConfirmClick={editItem}
            initialItem={editingItem}
          />
        ) : (
          <>
            <p className={styles.prompt}>
              Tap on a piece of litter in your photo and add details
            </p>
            <ItemOverviewList
              items={items}
              handleRemoveItem={handleRemoveItem}
              handleItemClick={handleEditItemClick}
            />
          </>
        )}
        {!(addingNewItem || editingItem) && (
          <Button
            disabled={items.length === 0}
            variant="contained"
            color="primary"
            className={styles.button}
            onClick={() => history.push(linkToUploadPhotoDialog())}
          >
            Submit Collection
          </Button>
        )}
      </div>

      <Route path={linkToUploadPhotoDialog()}>
        <UploadPhotoDialog
          imgSrc={photo && photo.imgSrc}
          online
          items={items}
          imgLocation={photo && photo.imgLocation}
          onCancelUpload={() =>
            history.push(history.location.pathname, history.location.state)
          }
        />
      </Route>
    </>
  );
}
