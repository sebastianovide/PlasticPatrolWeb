const fetch = require("node-fetch");

const URL =
  "https://us-central1-plastic-patrol-dev-722eb.cloudfunctions.net/computeStats";

(async function () {
  const result = await fetch(URL);
  const stats = await result.json();
  console.log(stats);
})();
