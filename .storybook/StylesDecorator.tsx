import React from "react";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import config from "custom/config";

const StylesDecorator = (storyFn: any) => {
  const theme = createMuiTheme(config.THEME);
  return <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>;
};

export default StylesDecorator;
