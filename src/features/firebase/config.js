console.log("got env: " + process.env.NODE_ENV);
const config =
  false && process.env.NODE_ENV === "development"
    ? require("./config.dev.json")
    : require("./config.json");

export default config;
