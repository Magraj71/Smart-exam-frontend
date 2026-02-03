import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  code: string;
  grade: string;
  section?: string;
  academicYear: string;
  classTeacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  maxStrength: number;
  currentStrength: number;
  subjects: mongoose.Types.ObjectId[];
  timetable?: Array<{
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    periods: Array<{
      period: number;
      subjectId: mongoose.Types.ObjectId;
      teacherId: mongoose.Types.ObjectId;
      room?: string;
    }>;
  }>;
  status: 'active' | 'graduated' | 'discontinued';
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  grade: { type: String, required: true },
  section: { type: String },
  academicYear: { type: String, required: true },
  classTeacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  maxStrength: { type: Number, required: true, min: 1 },
  currentStrength: { type: Number, default: 0 },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  timetable: [{
    day: { 
      type: String, 
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    periods: [{
      period: { type: Number, min: 1 },
      subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
      teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
      room: { type: String }
    }]
  }],
  status: { 
    type: String, 
    enum: ['active', 'graduated', 'discontinued'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);