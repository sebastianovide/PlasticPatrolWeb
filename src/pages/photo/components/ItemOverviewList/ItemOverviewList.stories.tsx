// @ts-nocheck

import React, { useState } from "react";
import faker from "faker";

import ItemOverviewList from "./ItemOverviewList";

export default { title: "ItemOverviewList", component: ItemOverviewList };

function ListWithButton() {
  const [items, setItems] = useState<Item[]>([]);
  const addItem = () => {
    setItems([
      ...items,
      {
        quantity: faker.random.number(),
        brand: faker.company.companyName(),
        type: faker.random.word()
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, itemIndex) => itemIndex !== index);

    setItems(newItems);
  };

  return (
    <>
      <button onClick={addItem} style={{ margin: 5 }}>
        Add item
      </button>
      <ItemOverviewList items={items} handleRemoveItem={handleRemoveItem} />
    </>
  );
}

export const list = () => <ListWithButton />;
