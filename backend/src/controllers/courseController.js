import db from "../config/firebase.js";

const coursesRef = db.ref("courses");

/**
 * @desc Get all courses
 * @route GET /api/courses
 */
export const getCourses = async (req, res) => {
  try {
    const snapshot = await coursesRef.once("value");
    const data = snapshot.val() || {};
    const courses = Object.entries(data)
      .map(([id, course]) => ({ id, ...course }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

/**
 * @desc Create a new course
 * @route POST /api/courses
 */
export const createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    if (!courseData.title || !courseData.description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newCourseRef = coursesRef.push();
    const newCourse = {
      ...courseData,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    await newCourseRef.set(newCourse);
    const course = { id: newCourseRef.key, ...newCourse };
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

/**
 * @desc Update a course
 * @route PUT /api/courses/:id
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;
    await coursesRef.child(id).update(courseData);

    const snapshot = await coursesRef.child(id).once("value");
    const course = { id, ...snapshot.val() };
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

/**
 * @desc Delete a course
 * @route DELETE /api/courses/:id
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await coursesRef.child(id).remove();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

/**
 * @desc Toggle course like
 * @route PUT /api/courses/:id/like
 */
export const toggleCourseLike = async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await coursesRef.child(id).once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Course not found" });
    }

    const course = snapshot.val();
    const currentlyLiked = course.isLiked || false;
    const newIsLiked = !currentlyLiked;
    const newLikes = newIsLiked
      ? (course.likes || 0) + 1
      : Math.max(0, (course.likes || 0) - 1);

    await coursesRef.child(id).update({ likes: newLikes, isLiked: newIsLiked });
    res.status(200).json({ isLiked: newIsLiked, likes: newLikes });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};
