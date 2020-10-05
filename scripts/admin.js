const admin = require("firebase-admin");
const yargs = require("yargs");
admin.initializeApp();
const auth = admin.auth();

const argv = yargs
  .option("id", {
    description: "UID of the user to inspect",
    type: "string"
  })
  .help()
  .alias("help", "h").argv;

(async function () {
  const user = await auth.getUser(argv.id);
  console.log(JSON.stringify(user));
})();
