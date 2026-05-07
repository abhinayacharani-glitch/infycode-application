import express from "express";
const router = express.Router();
import { getBatchMaterials, uploadMaterial } from "../controllers/materialController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.get("/:batchId", verifyToken, getBatchMaterials);
router.post("/upload", verifyToken, uploadMaterial);

export default router;
