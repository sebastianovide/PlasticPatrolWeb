const fetch = require("node-fetch");
const yargs = require("yargs");
const { PubSub } = require("@google-cloud/pubsub");
const prompt = require("prompt-sync")();

const COMPUTE_STATS_URL_DEV =
  "https://us-central1-plastic-patrol-dev-722eb.cloudfunctions.net/computeStats";
const FETCH_STATS_URL_DEV =
  "https://us-central1-plastic-patrol-dev-722eb.cloudfunctions.net/api/stats";
const COMPUTE_STATS_URL =
  "https://us-central1-plastic-patrol-fd3b3.cloudfunctions.net/computeStats";
const FETCH_STATS_URL =
  "https://us-central1-plastic-patrol-fd3b3.cloudfunctions.net/api/stats";

const argv = yargs
  .option("prod", {
    description: "Get data from production",
    type: "boolean"
  })
  .option("save", {
    description: "Save the stats to firebase",
    type: "boolean"
  })
  .option("cached", {
    description: "Will print the cached stats in firebase",
    type: "boolean"
  })
  .option("compute", {
    description:
      "Whether we should trigger the compute stats function instead of just fetching them",
    type: "boolean"
  })
  .help()
  .alias("help", "h").argv;

(async function () {
  if (argv.cached === true) {
    const { firebase } = require("./util");
    const stats = await firebase
      .firestore()
      .collection("sys")
      .doc("stats")
      .get();
    console.log(stats.data());
    firebase.app().delete();
    return;
  }

  const result = await fetch(
    argv.compute
      ? argv.prod
        ? COMPUTE_STATS_URL
        : COMPUTE_STATS_URL_DEV
      : argv.prod
      ? FETCH_STATS_URL
      : FETCH_STATS_URL_DEV
  );
  const stats = await result.json();
  console.log(JSON.stringify(stats));

  if (argv.save !== true) {
    return;
  }

  const pubsub = new PubSub();

  // NOTE that this is sort of cheating in that we don't actually write to firebsae
  // directly, instead we publish to the stats topic which will trigger the real flow.
  const resp = prompt(
    "Confirm that you want to save the above stats to Firebase? [y/n] "
  );
  if (resp === "y") {
    process.stdout.write("saving to Firebase (via pub/sub hook) ... ");
    await pubsub
      .topic("update-stats")
      .publish(Buffer.from("Recreate the stats"));
    console.log("Done");
  } else {
    console.log("not saving");
  }
})();
