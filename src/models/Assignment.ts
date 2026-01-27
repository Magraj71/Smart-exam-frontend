// models/Assignment.ts
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    studentName: String,
    subject: String,
    type: String,
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
    },
    submittedAt: Date,
    evaluated: { type: Boolean, default: false },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", assignmentSchema);
