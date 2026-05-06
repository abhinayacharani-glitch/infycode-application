import "dotenv/config";
import db from "../src/config/firebase.js";

const coursesRef = db.ref("courses");

const updateCategory = async () => {
  try {
    const snapshot = await coursesRef.once("value");
    const data = snapshot.val();
    if (!data) return;

    for (const [id, course] of Object.entries(data)) {
      if (course.category === "Security" || course.title.toLowerCase().includes("cybersecurity")) {
        console.log(`Updating category for course: ${course.title}`);
        await coursesRef.child(id).update({ category: "Cybersecurity" });
      }
    }
    console.log("Categories updated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating categories:", error);
    process.exit(1);
  }
};

updateCategory();
