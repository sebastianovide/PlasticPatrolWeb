import admin from "firebase-admin";

admin.initializeApp();
export const firestore = admin.firestore();
export const auth = admin.auth();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
