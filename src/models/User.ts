import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  // Basic Information
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  phone?: string;
  address?: string;
  profilePicture?: string;
  
  // Student Specific Fields
  studentId?: string;
  rollNumber?: string;
  class?: string;
  section?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  
  // Parent-Child Relationship
  parentId?: mongoose.Types.ObjectId; // For student: parent reference
  children?: mongoose.Types.ObjectId[]; // For parent: children references
  
  // Teacher Specific Fields
  teacherId?: string;
  subjects?: string[];
  qualification?: string;
  experience?: number; // in years
  department?: string;
  joiningDate?: Date;
  
  // Academic Information
  currentSemester?: number;
  academicYear?: string;
  enrollmentDate?: Date;
  
  // Guardian Information (for students)
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelation?: string;
  
  // Account Status
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  
  // Security
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
  
  // Preferences
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'teacher', 'student', 'parent'],
    index: true
  },
  phone: { type: String },
  address: { type: String },
  profilePicture: { type: String, default: '' },
  
  // Student Specific Fields
  studentId: { 
    type: String, 
    unique: true, 
    sparse: true,
    index: true 
  },
  rollNumber: { type: String },
  class: { type: String },
  section: { type: String },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'] 
  },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] 
  },
  
  // Parent-Child Relationship
  parentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    index: true 
  },
  children: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  // Teacher Specific Fields
  teacherId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  subjects: [{ type: String }],
  qualification: { type: String },
  experience: { type: Number, default: 0 },
  department: { type: String },
  joiningDate: { type: Date },
  
  // Academic Information
  currentSemester: { type: Number, min: 1, max: 8 },
  academicYear: { type: String },
  enrollmentDate: { type: Date },
  
  // Guardian Information
  guardianName: { type: String },
  guardianPhone: { type: String },
  guardianEmail: { type: String },
  guardianRelation: { type: String },
  
  // Account Status
  isActive: { type: Boolean, default: true, index: true },
  isVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  
  // Security
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  emailVerificationToken: { type: String },
  emailVerified: { type: Boolean, default: false },
  
  // Preferences
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function(this: IUser) {
  return this.name;
});

// Indexes for better query performance
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ class: 1, section: 1, rollNumber: 1 });
UserSchema.index({ email: 1, role: 1 });

// REMOVED THE PROBLEMATIC PRE-SAVE MIDDLEWARE

// Method to check if account is locked
UserSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Method to increment login attempts
UserSchema.methods.incLoginAttempts = function (): Promise<IUser> {
  const updates: any = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates["$set"] = {
      lockUntil: new Date(Date.now() + 30 * 60 * 1000),
    };
  }

  return this.updateOne(updates).exec();
};


// Method to reset login attempts on successful login
UserSchema.methods.resetLoginAttempts = function(): Promise<IUser> {
  return this.updateOne({
    $set: { loginAttempts: 0, lockUntil: null }
  }).exec();
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);