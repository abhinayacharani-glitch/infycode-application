import express from "express";
import { getSyllabuses, createSyllabus } from "../controllers/syllabusController.js";

const router = express.Router();

router.get("/", getSyllabuses);
router.post("/", createSyllabus);

export default router;
