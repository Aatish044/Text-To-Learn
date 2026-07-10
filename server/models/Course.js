import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    topic: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
       user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
