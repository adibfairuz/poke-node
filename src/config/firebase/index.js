var admin = require("firebase-admin");
const { getFirestore } = require('firebase-admin/firestore');

var key = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(key)
});

const db = getFirestore()

module.exports = db