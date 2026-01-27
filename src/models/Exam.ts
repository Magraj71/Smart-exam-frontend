import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  name: string;
  subject: string;
  class: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  teacherId: mongoose.Types.ObjectId;
  status: 'scheduled' | 'ongoing' | 'completed';
  createdAt: Date;
}

const ExamSchema: Schema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'ongoing', 'completed'], 
    default: 'scheduled' 
  },
}, { timestamps: true });

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);