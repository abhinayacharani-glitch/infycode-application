import admin from "firebase-admin";

if (!admin.apps.length) {
  const privateKey = process.env.FIRESTORE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const missingVars = [];
  if (!process.env.FIRESTORE_PROJECT_ID) missingVars.push("FIRESTORE_PROJECT_ID");
  if (!process.env.FIRESTORE_CLIENT_EMAIL) missingVars.push("FIRESTORE_CLIENT_EMAIL");
  if (!privateKey) missingVars.push("FIRESTORE_PRIVATE_KEY");

  if (missingVars.length > 0) {
    console.error(
      `\x1b[31m[Firebase Config] CRITICAL: Missing environment variables: ${missingVars.join(", ")}\x1b[0m`
    );
    console.error(
      `\x1b[33m[Firebase Config] Ensure your backend/.env contains FIRESTORE_* variables.\x1b[0m`
    );
    process.exit(1); // Hard fail so the bug is not silent
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIRESTORE_PROJECT_ID,
        clientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
        privateKey,
      }),
    });
    console.log("[Firebase Config] ✅ Firestore Admin SDK initialized successfully.");
  } catch (error) {
    console.error("[Firebase Config] ❌ Initialization failed:", error.message);
    process.exit(1);
  }
}

const db = admin.firestore();

export { admin };
export default db;