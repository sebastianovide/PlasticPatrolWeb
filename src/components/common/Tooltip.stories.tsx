// @ts-nocheck

import React from "react";

import Tooltip from "./Tooltip";

export default { title: "Tooltip", component: Tooltip };

const props = {
  tooltip: "some info"
};

export const defaultSelector = () => <Tooltip {...props} />;
