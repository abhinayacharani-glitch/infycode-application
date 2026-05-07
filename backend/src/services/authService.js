import db from "../config/firebase.js";

const studentsRef = db.collection("students");
const adminsRef = db.collection("admins");

export const findUserByUsername = async (role, username) => {
  const collection = role === "admin" ? adminsRef : studentsRef;
  const snapshot = await collection
    .where("username", "==", username)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const createStudent = async (studentData) => {
  const student = {
    ...studentData,
    role: "student",
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  const docRef = await studentsRef.add(student);
  return docRef.id;
};

