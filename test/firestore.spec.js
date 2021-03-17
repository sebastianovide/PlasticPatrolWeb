// this comes from https://github.com/firebase/quickstart-testing/tree/master/unit-test-security-rules

const firebase = require("@firebase/rules-unit-testing");
const fs = require("fs");
const http = require("http");

/**
 * The emulator will accept any project ID for testing.
 */
const PROJECT_ID = "firestore-emulator-example";

const APP_OPTIONS = {
  projectId: PROJECT_ID
};

const NORMAL_USER = {
  uid: "normal",
  data: {
    someField: "hello"
  }
};

const ANOTHER_USER = {
  uid: "another",
  data: {
    someField: "hello"
  }
};

const ADMIN_USER = {
  uid: "admin",
  data: {
    isAdmin: true
  }
};

const USERS = [NORMAL_USER, ANOTHER_USER, ADMIN_USER];

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
function getAuthedFirestore(auth) {
  return firebase.initializeTestApp({ ...APP_OPTIONS, auth }).firestore();
}

function getAdminFirestore() {
  return firebase.initializeAdminApp(APP_OPTIONS).firestore();
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData(APP_OPTIONS);

  // Create dummy DB
  const db = getAdminFirestore();

  USERS.forEach(async (user) => {
    await db.collection("users").doc(user.uid).set(user.data);
  });
});

before(async () => {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync("firestore.rules", "utf8");
  await firebase.loadFirestoreRules({ ...APP_OPTIONS, rules });
});

after(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()));

  // Write the coverage report to a file
  const coverageFile = "firestore-coverage.html";
  const fstream = fs.createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    http.get(COVERAGE_URL, (res) => {
      res.pipe(fstream, { end: true });

      res.on("end", resolve);
      res.on("error", reject);
    });
  });

  console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

describe("Moderator Users", () => {
  // TODO cannot update existing user
});

describe("Admin Users", () => {
  // TODO can update existing user
});

describe("Loggedin Users", () => {
  let db;

  before(async () => {
    db = getAuthedFirestore(NORMAL_USER);
  });

  it("should be able to read own data", async () => {
    const user = db.collection("users").doc(NORMAL_USER.uid);
    await firebase.assertSucceeds(user.get());
  });

  it("cannot read others data", async () => {
    const user = db.collection("users").doc(ANOTHER_USER.uid);
    await firebase.assertFails(user.get());
  });

  it("cannot change the field isAdmin", async () => {
    const user = db.collection("users").doc(NORMAL_USER.uid);
    await firebase.assertFails(user.set({ isAdmin: true }));
  });

  it("cannot change the field isModerator", async () => {
    const user = db.collection("users").doc(NORMAL_USER.uid);
    await firebase.assertFails(user.set({ isModerator: true }));
  });

  it("cannot change the field isTester", async () => {
    const user = db.collection("users").doc(NORMAL_USER.uid);
    await firebase.assertFails(user.set({ isTester: true }));
  });
});

describe("Anonymous Users", () => {
  let db;

  before(async () => {
    db = getAuthedFirestore(null);
  });

  it("should be able to write feedbacks", async () => {
    const feedbacks = db.collection("feedbacks");
    await firebase.assertSucceeds(feedbacks.add({ someField: "some value" }));
  });
  it("should not be able to read feedbacks", async () => {
    const feedbacks = db.collection("feedbacks");
    await firebase.assertFails(feedbacks.get());
  });

  //   it("require users to log in before creating a profile", async () => {
  //     const db = getAuthedFirestore(null);
  //     const profile = db.collection("users").doc("alice");
  //     await firebase.assertFails(profile.set({ birthday: "January 1" }));
  //   });

  //   it("should enforce the createdAt date in user profiles", async () => {
  //     const db = getAuthedFirestore({ uid: "alice" });
  //     const profile = db.collection("users").doc("alice");
  //     await firebase.assertFails(profile.set({ birthday: "January 1" }));
  //     await firebase.assertSucceeds(
  //       profile.set({
  //         birthday: "January 1",
  //         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       })
  //     );
  //   });

  //   it("should only let users create their own profile", async () => {
  //     const db = getAuthedFirestore({ uid: "alice" });
  //     await firebase.assertSucceeds(
  //       db.collection("users").doc("alice").set({
  //         birthday: "January 1",
  //         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       })
  //     );
  //     await firebase.assertFails(
  //       db.collection("users").doc("bob").set({
  //         birthday: "January 1",
  //         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       })
  //     );
  //   });

  //   it("should let anyone read any profile", async () => {
  //     const db = getAuthedFirestore(null);
  //     const profile = db.collection("users").doc("alice");
  //     await firebase.assertSucceeds(profile.get());
  //   });

  //   it("should let anyone create a room", async () => {
  //     const db = getAuthedFirestore({ uid: "alice" });
  //     const room = db.collection("rooms").doc("firebase");
  //     await firebase.assertSucceeds(
  //       room.set({
  //         owner: "alice",
  //         topic: "All Things Firebase",
  //       })
  //     );
  //   });

  //   it("should force people to name themselves as room owner when creating a room", async () => {
  //     const db = getAuthedFirestore({ uid: "alice" });
  //     const room = db.collection("rooms").doc("firebase");
  //     await firebase.assertFails(
  //       room.set({
  //         owner: "scott",
  //         topic: "Firebase Rocks!",
  //       })
  //     );
  //   });

  //   it("should not let one user steal a room from another user", async () => {
  //     const alice = getAuthedFirestore({ uid: "alice" });
  //     const bob = getAuthedFirestore({ uid: "bob" });

  //     await firebase.assertSucceeds(
  //       bob.collection("rooms").doc("snow").set({
  //         owner: "bob",
  //         topic: "All Things Snowboarding",
  //       })
  //     );

  //     await firebase.assertFails(
  //       alice.collection("rooms").doc("snow").set({
  //         owner: "alice",
  //         topic: "skiing > snowboarding",
  //       })
  //     );
  //   });
});
