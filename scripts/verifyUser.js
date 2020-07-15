const admin = require("firebase-admin");

const serviceAccount = require("../adminCreds.prod.json");

const userId = "ukrJWbR7oxXiViT7UGY3MVEs6u52";

// get credentials to run this from https://console.firebase.google.com/u/0/project/plastic-patrol-dev-722eb/settings/serviceaccounts/adminsdk
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://plastic-patrol-dev-722eb.firebaseio.com"
  // databaseURL: "https://plastic-patrol-fd3b3.firebaseio.com"
});

async function verify() {
  await admin.auth().updateUser(userId, {
    emailVerified: true
  });
  console.log("done");

  process.exit(0);
}

verify();
