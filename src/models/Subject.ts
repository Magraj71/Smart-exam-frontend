import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  description?: string;
  department?: string;
  credits: number;
  theoryHours: number;
  practicalHours: number;
  isElective: boolean;
  electiveGroup?: string;
  teacherId: mongoose.Types.ObjectId;
  syllabus?: Array<{
    unit: number;
    title: string;
    topics: string[];
    weightage: number;
  }>;
  textbooks?: Array<{
    title: string;
    author: string;
    edition: string;
    isbn?: string;
  }>;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String },
  department: { type: String },
  credits: { type: Number, required: true, min: 0 },
  theoryHours: { type: Number, default: 0 },
  practicalHours: { type: Number, default: 0 },
  isElective: { type: Boolean, default: false },
  electiveGroup: { type: String },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
  syllabus: [{
    unit: { type: Number },
    title: { type: String },
    topics: [{ type: String }],
    weightage: { type: Number, min: 0, max: 100 }
  }],
  textbooks: [{
    title: { type: String },
    author: { type: String },
    edition: { type: String },
    isbn: { type: String }
  }],
  status: { 
    type: String, 
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);