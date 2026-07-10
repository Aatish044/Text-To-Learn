import Lesson from "../models/Lesson.js";
import Module from "../models/Module.js";
import { generateLessonContent } from "../services/aiService.js";

// POST /api/lessons/:id/generate  — generate rich content for a lesson
export const generateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate({
      path: "module",
      populate: { path: "course" },
    });

    if (!lesson) return res.status(404).json({ error: "Lesson not found." });

    const courseTitle = lesson.module.course.title;
    const moduleTitle = lesson.module.title;
    const lessonTitle = lesson.title;

    const generated = await generateLessonContent(courseTitle, moduleTitle, lessonTitle);

    lesson.content = generated.content || [];
    lesson.objectives = generated.objectives || [];
    lesson.isEnriched = true;
    await lesson.save();

    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

// GET /api/lessons/:id  — get a single lesson
export const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate({
      path: "module",
      populate: { path: "course" },
    });
    if (!lesson) return res.status(404).json({ error: "Lesson not found." });
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};
