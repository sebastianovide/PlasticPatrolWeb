import React, { useState } from "react";
import { Route, useHistory, useParams } from "react-router";

import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Link from "@material-ui/core/Link";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import { Item } from "../../types";
import AddNewItem from "../../components/AddNewItem/AddNewItem";
import ItemOverviewList from "../../components/ItemOverviewList/ItemOverviewList";
import { ImageMetadata, isCordovaFileState } from "types/Photo";

import {
  useGetLocationFileState,
  linkToUploadPhotoDialog
} from "routes/photo/routes/categorise/links";
import loadPhoto from "./utils";
import UploadPhotoDialog from "pages/photo/components/UploadPhotoDialog";
import { linkToNewPhoto } from "routes/photo/routes/new/links";
import { useGPSLocation } from "LocationProvider";
import useEffectOnMount from "hooks/useEffectOnMount";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(1),
    boxSizing: "border-box"
  },
  img: {
    height: "50%",
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
  const fileState = useGetLocationFileState();
  const { fileName } = useParams();
  const history = useHistory();
  const gpsLocation = useGPSLocation();

  const [photo, setPhoto] = useState<ImageMetadata | undefined>();
  useEffectOnMount(() => {
    if (fileState === undefined) {
      history.push(linkToNewPhoto());
    } else {
      var fileOrFilePath, cordovaMetadata;
      if (isCordovaFileState(fileState)) {
        fileOrFilePath = fileState.filePath;
        cordovaMetadata = fileState.cordovaMetadata;
      } else {
        fileOrFilePath = fileState.file;
        cordovaMetadata = undefined;
      }
      loadPhoto({
        photoToLoad: fileOrFilePath,
        fromCamera: fileState.fromCamera,
        gpsLocation,
        cordovaMetadata,
        callback: (metadata) => {
          setPhoto(metadata);
        }
      });
    }
  });

  return (
    <CategoriseLitterPageWithFileInfo
      fileName={fileName as string}
      photo={photo}
    />
  );
}

export function CategoriseLitterPageWithFileInfo({
  fileName,
  photo
}: {
  fileName: string;
  photo?: ImageMetadata;
}) {
  const classes = useStyles();
  const history = useHistory();

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
      <Dialog
        open={!!(photo && photo.imgLocation === "not online")}
        onClose={() => history.push(linkToNewPhoto())}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span style={{ fontWeight: 500 }}>
              We couldn't find your location so you won't be able to upload an
              image right now. Enable GPS on your phone and retake the photo to
              upload it.
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => history.push(linkToNewPhoto())}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!(photo && photo.imgLocation === "unable to extract from file")}
        onClose={() => history.push(linkToNewPhoto())}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span style={{ fontWeight: 500 }}>
              Your photo isn't geo-tagged so it can't be uploaded. To fix this
              manually, you can geo-tag it online with a tool like&nbsp;
              <Link href={"https://tool.geoimgr.com/"} className={classes.link}>
                Geoimgr
              </Link>
              . In the future, make sure GPS is enabled and your camera has
              access to it.
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => history.push(linkToNewPhoto())}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
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
