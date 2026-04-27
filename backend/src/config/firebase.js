import admin from "firebase-admin";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const missingVars = [];
  if (!process.env.FIREBASE_PROJECT_ID) missingVars.push("FIREBASE_PROJECT_ID");
  if (!process.env.FIREBASE_CLIENT_EMAIL) missingVars.push("FIREBASE_CLIENT_EMAIL");
  if (!privateKey) missingVars.push("FIREBASE_PRIVATE_KEY");
  if (!process.env.FIREBASE_DATABASE_URL) missingVars.push("FIREBASE_DATABASE_URL");

  if (missingVars.length > 0) {
    console.error(`\x1b[31m[Firebase Config] CRITICAL: Missing environment variables: ${missingVars.join(", ")}\x1b[0m`);
    console.error(`\x1b[33m[Firebase Config] Make sure you have a .env file in the backend directory.\x1b[0m`);
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log("[Firebase Config] Admin SDK initialized successfully.");
  } catch (error) {
    console.error("[Firebase Config] Initialization error:", error.message);
  }
}


const db = admin.database();

export default db;