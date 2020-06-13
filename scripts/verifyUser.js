const admin = require("firebase-admin");

const serviceAccount = require("../adminCreds.dev.json");

const userId = "ZuyJV8JF4qfMGuHBgPnJJ48VPtA2";

// get credentials to run this from https://console.firebase.google.com/u/0/project/plastic-patrol-dev-722eb/settings/serviceaccounts/adminsdk
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://plastic-patrol-dev-722eb.firebaseio.com"
});

async function verify() {
  await admin.auth().updateUser(userId, {
    emailVerified: true
  });
  console.log("done");

  process.exit(0);
}

verify();
