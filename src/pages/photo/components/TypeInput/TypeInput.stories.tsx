// @ts-nocheck

import React from "react";

import TypeInput from "./TypeInput";

export default { title: "TypeInput", component: TypeInput };

const props = {
  setType: () => {},
  className: ""
};

export const defaultSelector = () => <TypeInput {...props} />;
