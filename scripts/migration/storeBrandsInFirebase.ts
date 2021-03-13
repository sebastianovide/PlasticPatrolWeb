const admin = require("firebase-admin");

const brands = require("../../src/custom/brands.json");
const serviceAccount = require("../../adminCreds.test.json");

const brandsPath = () => "brands";
const brand = (brandId: string) => `${brandsPath()}/${brandId}`;

// get credentials to run this from https://console.firebase.google.com/u/0/project/plastic-patrol-dev-722eb/settings/serviceaccounts/adminsdk

async function storeCategories() {
  console.log("Initialising");
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://plastic-patrol-dev-test.firebaseio.com"
  });
  const firestore = admin.firestore();
  const bulkWriter = firestore.bulkWriter();

  console.log("Writing");

  Object.keys(brands).forEach((key) => {
    // @ts-ignore
    bulkWriter.create(firestore.doc(brand(key)), brands[key]);
  });

  await bulkWriter.close();

  await admin.app().delete();
  console.log("Added all brands!");

  process.exit(0);
}

storeCategories().catch(async (err) => {
  console.error(err);

  await admin.app().delete();

  process.exit(1);
});
