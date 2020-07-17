const { firebase } = require("./util");
const yargs = require("yargs");

const argv = yargs
  .option("id", {
    description: "Id of photo to fetch",
    type: "string"
  })
  .demand(["id"])
  .help()
  .alias("help", "h").argv;

(async function () {
  const firestore = firebase.firestore();
  try {
    const photo = await firestore.collection("photos").doc(argv.id).get();
    console.log(photo.data());
  } catch (e) {
    console.log(e);
  }

  process.exit(0);
})();
