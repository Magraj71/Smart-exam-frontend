import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  name: string;
  section?: string;
  grade: string;
  academicYear: string;
  classTeacher?: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  subjects: mongoose.Types.ObjectId[];
  capacity: number;
  roomNumber?: string;
  schedule?: Array<{
    day: string;
    period: number;
    subject: mongoose.Types.ObjectId;
    teacher: mongoose.Types.ObjectId;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String },
    grade: { type: String, required: true },
    academicYear: { type: String, required: true },
    classTeacher: { type: Schema.Types.ObjectId, ref: "User" },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    capacity: { type: Number, default: 40 },
    roomNumber: { type: String },
    schedule: [
      {
        day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
        period: { type: Number, min: 1, max: 8 },
        subject: { type: Schema.Types.ObjectId, ref: "Subject" },
        teacher: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ClassSchema.index({ name: 1, academicYear: 1 }, { unique: true });
ClassSchema.index({ grade: 1 });
ClassSchema.index({ classTeacher: 1 });

export default mongoose.models.Class || 
  mongoose.model<IClass>("Class", ClassSchema);