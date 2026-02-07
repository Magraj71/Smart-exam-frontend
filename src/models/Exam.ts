import mongoose, { Schema, Document } from "mongoose";

export interface IExam extends Document {
  title: string;
  description?: string;
  examType: "offline" | "online";
  class: string;
  section?: string;
  subjects: {
    subjectName: string;
    teacherId?: mongoose.Types.ObjectId;
    maxMarks: number;
    examDate: Date;
    duration: number; // minutes
  }[];
  status: "draft" | "scheduled" | "ongoing" | "completed" | "result-published";
  resultPublished: boolean;
  createdBy: mongoose.Types.ObjectId;
}

const ExamSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    description: String,
    examType: { type: String, enum: ["offline", "online"], default: "offline" },

    class: { type: String, required: true },
    section: String,

    subjects: [
      {
        subjectName: String,
        teacherId: { type: Schema.Types.ObjectId, ref: "User" },
        maxMarks: Number,
        examDate: Date,
        duration: Number,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "scheduled", "ongoing", "completed", "result-published"],
      default: "draft",
    },

    resultPublished: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Exam ||
  mongoose.model<IExam>("Exam", ExamSchema);
