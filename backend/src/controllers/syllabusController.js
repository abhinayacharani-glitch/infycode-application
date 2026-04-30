import db from "../config/firebase.js";

const syllabusRef = db.ref("syllabuses");

/**
 * @desc Get all syllabuses
 * @route GET /api/syllabuses
 */
export const getSyllabuses = async (req, res) => {
  try {
    const snapshot = await syllabusRef.once("value");
    const data = snapshot.val() || {};
    const syllabuses = Object.entries(data).map(([id, syllabus]) => ({
      id,
      ...syllabus,
    }));
    res.status(200).json({ syllabuses });
  } catch (error) {
    console.error("Error fetching syllabuses:", error);
    res.status(500).json({ error: "Failed to fetch syllabuses" });
  }
};

/**
 * @desc Create a new syllabus
 * @route POST /api/syllabuses
 */
export const createSyllabus = async (req, res) => {
  try {
    const { title, modules } = req.body;
    if (!title || !modules || !Array.isArray(modules)) {
      return res.status(400).json({ error: "Title and modules are required" });
    }

    const newSyllabusRef = syllabusRef.push();
    const newSyllabus = {
      title,
      modules,
      createdAt: new Date().toISOString(),
    };

    await newSyllabusRef.set(newSyllabus);
    res.status(201).json({
      message: "Syllabus created successfully",
      syllabus: { id: newSyllabusRef.key, ...newSyllabus },
    });
  } catch (error) {
    console.error("Error creating syllabus:", error);
    res.status(500).json({ error: "Failed to create syllabus" });
  }
};
