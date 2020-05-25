import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import PageWrapper from "components/PageWrapper";
import { Item } from "../types";
import AddNewItem from "./AddNewItem/AddNewItem";
import ItemOverviewList from "./ItemOverviewList/ItemOverviewList";

type Props = {
  imgSrc: string;
};

const useStyles = makeStyles(theme => ({
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
  }
}));
export default function CategoriseLitterPage({
  imgSrc = "https://upload.wikimedia.org/wikipedia/en/3/33/Snab_rubbish.jpg"
}) {
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
    <PageWrapper label={"Log your litter"} handleClose={() => {}}>
      <div className={styles.wrapper}>
        <img
          src={imgSrc}
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
          <Button variant="contained" color="primary" className={styles.button}>
            Submit Collection
          </Button>
        )}
      </div>
    </PageWrapper>
  );
}
