import admin from "firebase-admin";

const serviceAccount = require("../../serviceAccountKey.json");

export const administrator = admin.initializeApp({
  credential : admin.credential.cert(serviceAccount)
})

