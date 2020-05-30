import React, { useState, useEffect } from "react";
import { Route, useHistory, useParams } from "react-router";

import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Link from "@material-ui/core/Link";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import PageWrapper from "components/PageWrapper";
import { Item } from "../../types";
import AddNewItem from "../../components/AddNewItem/AddNewItem";
import ItemOverviewList from "../../components/ItemOverviewList/ItemOverviewList";
import { ImageMetadata } from "types/Photo";

import {
  useGetLocationFileState,
  linkToUploadPhoto
} from "routes/photo/routes/categorise/links";
import loadPhoto from "./utils";
import UploadPhotoDialog from "pages/photo/components/UploadPhotoDialog";
import { linkToNewPhoto } from "routes/photo/routes/new/links";

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
  const classes = useStyles();
  const fileState = useGetLocationFileState();
  const [photo, setPhoto] = useState<ImageMetadata | undefined>();
  const [notGeotagged, setNotGeotagged] = useState(false);
  const history = useHistory();
  const { fileName } = useParams();

  if (fileState === undefined) {
    history.push(linkToNewPhoto());
  }

  useEffect(() => {
    if (fileState) {
      const { file, cordovaMetaData } = fileState;
      loadPhoto({
        photoToLoad: file,
        srcType: "sany",
        gpsLocation: {
          latitude: 0,
          longitude: 0,
          online: false,
          updated: new Date()
        },
        cordovaMetaData,
        callback: (metadata) => {
          if (!metadata.imgLocation) {
            setPhoto(metadata);
            setNotGeotagged(true);
          } else {
            setPhoto(metadata);
          }
        }
      });
    }
  }, []);
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
              Tap on the pieces of litter in your photo to add litter details
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
            onClick={() => history.push(linkToUploadPhoto(fileName))}
          >
            Submit Collection
          </Button>
        )}
      </div>
      <Dialog
        open={notGeotagged}
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
      <Route path={linkToUploadPhoto()}>
        <UploadPhotoDialog
          imgSrc={photo && photo.imgSrc}
          online
          items={items}
          imgLocation={photo && photo.imgLocation}
        />
      </Route>
    </>
  );
}
