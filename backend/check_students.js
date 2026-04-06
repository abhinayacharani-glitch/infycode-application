import "dotenv/config";
import db from "./src/config/firebase.js";

const studentsRef = db.ref("students");

async function checkStudents() {
  try {
    const snapshot = await studentsRef.once("value");
    const students = snapshot.val();
    if(students) {
      const firstStudent = Object.values(students)[0];
      console.log("KEYS_OF_FIRST_STUDENT:", Object.keys(firstStudent).join(', '));
      console.log("First student details:", firstStudent);
    } else {
      console.log("No students found.");
    }
  } catch (err) {
    console.error("Error fetching students:", err);
  } finally {
    process.exit(0);
  }
}

checkStudents();
