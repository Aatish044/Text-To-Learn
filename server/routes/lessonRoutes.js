import express from "express";
import { getLessonById, generateLesson } from "../controllers/lessonController.js";

const router = express.Router();

router.get("/:id", getLessonById);
router.post("/:id/generate", generateLesson);

export default router;
