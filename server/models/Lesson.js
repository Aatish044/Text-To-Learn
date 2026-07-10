import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    objectives: [{ type: String }],
    content: { type: [mongoose.Schema.Types.Mixed], required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    order: { type: Number, default: 0 },
    isEnriched: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
