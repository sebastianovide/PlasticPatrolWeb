import React from "react";

import BarcodeScanner from "./BarcodeScanner";

export default { title: "BarcodeScanner", component: BarcodeScanner };

const item: any = {};
export const defaultSelector = () => (
  <BarcodeScanner
    onResult={(result) => {
      console.log(result);
    }}
  />
);
