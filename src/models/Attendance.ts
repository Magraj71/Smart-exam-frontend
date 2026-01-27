// models/Attendance.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late';
  subject?: string;
  teacherId: mongoose.Types.ObjectId;
  remarks?: string;
}

const AttendanceSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late'], 
    required: true 
  },
  subject: { type: String },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  remarks: { type: String },
});

export default mongoose.models.Attendance || 
       mongoose.model<IAttendance>('Attendance', AttendanceSchema);