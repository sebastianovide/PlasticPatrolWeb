import React from "react";

import { Item } from "../../types";
import ItemOverview from "../ItemOverview";

type Props = {
  items: Array<Item>;
  handleRemoveItem: (index: number) => void;
  handleItemClick: (index: number) => void;
};

export default function ItemOverviewList({
  items,
  handleRemoveItem,
  handleItemClick
}: Props) {
  return (
    <>
      {items.map((item, index) => {
        return (
          <ItemOverview
            {...item}
            handleRemove={() => handleRemoveItem(index)}
            handleClick={() => handleItemClick(index)}
            key={`${item.type}-${item.quantity}`}
          />
        );
      })}
    </>
  );
}
