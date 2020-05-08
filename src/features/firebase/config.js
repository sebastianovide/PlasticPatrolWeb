const config =
  !process.env.REACT_APP_USE_PROD_DATA && process.env.NODE_ENV === "development"
    ? require("./config.dev.json")
    : require("./config.json");

export default config;
