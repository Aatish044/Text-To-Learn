import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";
import { generateCourseOutline } from "../services/aiService.js";

// POST /api/courses/generate  — create full course from a topic prompt
export const generateCourse = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required." });
    }

    // 1. Ask AI for course outline
    const outline = await generateCourseOutline(topic.trim());

    // 2. Persist Course document
    const course = await Course.create({
      title: outline.title,
      description: outline.description,
      topic: topic.trim(),
      tags: outline.tags || [],
      user: req.user._id,
    });

    // 3. Persist Modules + empty Lessons (titles only)
    const moduleIds = [];
    for (let i = 0; i < outline.modules.length; i++) {
      const modData = outline.modules[i];

      const lessonIds = [];
      for (let j = 0; j < modData.lessons.length; j++) {
        const lesson = await Lesson.create({
          title: modData.lessons[j],
          content: [],
          objectives: [],
          order: j,
        });
        lessonIds.push(lesson._id);
      }

      const mod = await Module.create({
        title: modData.title,
        course: course._id,
        lessons: lessonIds,
        order: i,
      });

      // Back-fill module ref into lessons
      await Lesson.updateMany({ _id: { $in: lessonIds } }, { module: mod._id });
      moduleIds.push(mod._id);
    }

    // 4. Attach module IDs to course
    course.modules = moduleIds;
    await course.save();

    // 5. Return fully populated course
    const populated = await Course.findById(course._id).populate({
      path: "modules",
      populate: { path: "lessons" },
    });

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// GET /api/courses  — list all courses
export const getAllCourses = async (req, res, next) => {
  console.log(req.user);
  console.log("Fetching all courses...");
  try {
    const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 }).populate({
      path: "modules",
      populate: { path: "lessons" },
    });
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id  — single course
export const getCourseById = async (req, res, next) => {
  try {
   const course = await Course.findOne({
    _id: req.params.id,
    user: req.user._id,
})
.populate({
    path: "modules",
    populate: {
        path: "lessons",
    },
});
    if (!course) return res.status(404).json({ error: "Course not found." });
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:id  — delete a course and all its data
export const deleteCourse = async (req, res, next) => {
  try {
const course = await Course.findOne({
    _id: req.params.id,
    user: req.user._id,
}).populate("modules");
    if (!course) return res.status(404).json({ error: "Course not found." });

    for (const mod of course.modules) {
      await Lesson.deleteMany({ _id: { $in: mod.lessons } });
      await Module.findByIdAndDelete(mod._id);
    }
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course deleted successfully." });
  } catch (err) {
    next(err);
  }
};
