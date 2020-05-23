import React from "react";

import ItemOverview, { Item } from "../ItemOverview";

type Props = {
  items: Array<Item>;
  handleRemoveItem: (index: number) => void;
};

export default function ItemOverviewList({ items, handleRemoveItem }: Props) {
  return (
    <>
      {items.map((item, index) => {
        return (
          <ItemOverview
            {...item}
            handleRemove={() => handleRemoveItem(index)}
            key={`${item.type}-${item.quantity}`}
          />
        );
      })}
    </>
  );
}
