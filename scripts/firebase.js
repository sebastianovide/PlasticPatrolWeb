const { firebase } = require("./utils");

(async function () {
  const firestore = firebase.firestore();
  try {
    const photo = await firestore
      .collection("photos")
      .doc("ME2Gk9xHrY2YaexSnSQv")
      .get();
    console.log(photo.data());
  } catch (e) {
    console.log(e);
  }

  process.exit(0);
})();
