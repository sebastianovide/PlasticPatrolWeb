import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import PageWrapper from "components/PageWrapper";
import AddNewItem from "./AddNewItem/AddNewItem";
import ItemOverviewList from "./ItemOverviewList/ItemOverviewList";
import { Item } from "./ItemOverview";
import { Button } from "@material-ui/core";

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
            onAddClick={addNewItem}
          />
        ) : (
          <>
            <p className={styles.prompt}>
              Tap on the pieces of litter in your photo to add litter details
            </p>
            <ItemOverviewList
              items={items}
              handleRemoveItem={handleRemoveItem}
            />
          </>
        )}
        <Button variant="contained" color="primary" className={styles.button}>
          Submit Collection
        </Button>
      </div>
    </PageWrapper>
  );
}
