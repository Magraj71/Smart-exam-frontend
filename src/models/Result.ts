import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
  studentId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  status: 'pass' | 'fail';
  teacherRemarks?: string;
  publishedAt: Date;
}

const ResultSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  subject: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  grade: { type: String, required: true },
  status: { type: String, enum: ['pass', 'fail'], required: true },
  teacherRemarks: { type: String },
  publishedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);