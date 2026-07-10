import express from "express";
import {
  generateCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/generate", protect, generateCourse);
router.get("/", protect, getAllCourses);
router.get("/:id", protect, getCourseById);
router.delete("/:id", protect, deleteCourse);

export default router;
