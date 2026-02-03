import mongoose, { Schema, Document, Model } from "mongoose";

/* =========================
   SECTION TYPES
========================= */
interface ISection {
  name: string;
  description?: string;
  totalQuestions: number;
  marksPerQuestion: number;
  totalSectionMarks: number;
  questionType: "mcq" | "descriptive" | "truefalse" | "fillblank" | "practical";
  negativeMarking?: number;
  instructions?: string;
  hasSubSections: boolean;
  subSections?: Array<{
    name: string;
    questions: number;
    marksPerQuestion: number;
  }>;
}

/* =========================
   QUESTION TYPES
========================= */
interface IQuestion {
  sectionIndex: number;
  questionNumber: number;
  questionText: string;
  questionType: "mcq" | "descriptive" | "truefalse" | "fillblank" | "practical";
  marks: number;
  options?: string[];
  correctAnswer?: string | string[];
  answerKey?: string;
  difficulty: "easy" | "medium" | "hard";
  topic?: string;
  subTopic?: string;
  hasImage: boolean;
  imageUrl?: string;
  hasAttachment: boolean;
  attachmentUrl?: string;
  isCompulsory: boolean;
  timeLimit?: number;
}

/* =========================
   STUDENT RESULT TYPES
========================= */
interface IStudentResult {
  studentId: mongoose.Types.ObjectId;
  rollNumber: string;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  answers: Array<{
    questionId: mongoose.Types.ObjectId;
    studentAnswer: string | string[];
    marksObtained: number;
    isCorrect: boolean;
    evaluatedBy?: mongoose.Types.ObjectId;
    evaluationDate?: Date;
    remarks?: string;
  }>;
  status:
    | "absent"
    | "present"
    | "disqualified"
    | "recheck_requested"
    | "rechecked";
  attendanceStatus: "present" | "absent" | "late" | "leave";
  submittedAt?: Date;
  evaluatedAt?: Date;
  recheckRequested?: boolean;
  recheckReason?: string;
}

/* =========================
   MAIN EXAM INTERFACE
========================= */
export interface IExam extends Document {
  // Basic Information
  title: string;
  code: string;
  description?: string;
  subjectId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  batch?: string;
  academicYear: string;
  term: "first" | "second" | "final" | "unit" | "mid" | "preboard";
  examType: "theory" | "practical" | "oral" | "viva" | "project" | "combined";
  category: "regular" | "supplementary" | "improvement" | "re-test";

  // Schedule & Duration
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  reportingTime?: string;
  lateEntryAllowed: boolean;
  lateEntryDuration?: number;
  isOnline: boolean;
  examMode: "offline" | "online" | "hybrid";

  // Location
  venue?: string;
  room?: string;
  lab?: string;
  seatPlan?: Array<{
    rollNumber: string;
    seatNumber: string;
    room: string;
  }>;

  // Marks & Evaluation
  totalMarks: number;
  passingMarks: number;
  theoryMarks?: number;
  practicalMarks?: number;
  internalMarks?: number;
  externalMarks?: number;
  hasNegativeMarking: boolean;
  negativeMarksPerQuestion?: number;
  gradingSystem: "percentage" | "cgpa" | "grades";
  gradeScale?: Array<{
    minPercentage: number;
    maxPercentage: number;
    grade: string;
    gradePoint: number;
  }>;

  // Question Paper Structure
  totalQuestions: number;
  sections: ISection[];
  questions: IQuestion[];
  questionBankId?: mongoose.Types.ObjectId;
  hasSections: boolean;
  difficultyLevel: "easy" | "medium" | "hard" | "mixed";
  blueprint?: {
    topics: Array<{
      topic: string;
      questions: number;
      marks: number;
      weightage: number;
    }>;
  };

  // Rules & Instructions
  instructions: string[];
  allowedMaterials: string[];
  prohibitedItems: string[];
  specialInstructions?: string;
  calculatorAllowed: boolean;
  extraSheetAllowed: boolean;
  roughWorkAllowed: boolean;
  mobilePolicy: "strictly_prohibited" | "silent_mode" | "allowed";

  // Access & Registration
  isPublished: boolean;
  publishedAt?: Date;
  requireRegistration: boolean;
  registrationStartDate?: Date;
  registrationEndDate?: Date;
  maxStudents?: number;
  registeredStudents: mongoose.Types.ObjectId[];
  registrationStatus: "open" | "closed" | "pending";

  // Invigilation & Supervision
  chiefInvigilator: mongoose.Types.ObjectId;
  invigilators: mongoose.Types.ObjectId[];
  externalExaminer?: mongoose.Types.ObjectId;
  supervisor?: mongoose.Types.ObjectId;
  attendanceVerifiedBy?: mongoose.Types.ObjectId;

  // Results & Evaluation
  resultsPublished: boolean;
  resultsPublishedAt?: Date;
  evaluationStartDate?: Date;
  evaluationEndDate?: Date;
  answerKeyPublished: boolean;
  answerKeyPublishedAt?: Date;
  allowResultView: boolean;
  allowAnswerReview: boolean;
  allowRecheckRequest: boolean;
  recheckLastDate?: Date;
  graceMarks?: number;

  // Student Data
  totalRegistered: number;
  totalAppeared: number;
  totalPassed: number;
  totalFailed: number;
  averagePercentage?: number;
  highestMarks?: number;
  lowestMarks?: number;
  studentResults: IStudentResult[];
  toppers?: Array<{
    studentId: mongoose.Types.ObjectId;
    rank: number;
    marks: number;
  }>;

  // Status & Tracking
  status:
    | "draft"
    | "scheduled"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "postponed";
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  cancelledReason?: string;
  postponedDate?: Date;
  postponedReason?: string;

  // Technical & Online Exam Fields
  platform?: "google_forms" | "moodle" | "custom" | "offline";
  examLink?: string;
  meetingId?: string;
  passcode?: string;
  technologyRequirements?: string[];
  technicalSupportContact?: string;
  systemCheckRequired: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  // Methods
  publishExam: () => Promise<IExam>;
  publishResults: () => Promise<IExam>;
  addStudentResult: (studentResult: any) => Promise<IExam>;
}

/* =========================
   STATIC METHODS TYPE
========================= */
interface IExamModel extends Model<IExam> {
  findUpcoming: (days?: number) => Promise<IExam[]>;
  getStatistics: (examId: string) => Promise<any>;
}

/* =========================
   SUB SCHEMAS
========================= */
const SectionSchema = new Schema<ISection>(
  {
    name: { type: String, required: true },
    description: { type: String },
    totalQuestions: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 0 },
    totalSectionMarks: { type: Number, required: true, min: 0 },
    questionType: {
      type: String,
      enum: ["mcq", "descriptive", "truefalse", "fillblank", "practical"],
      required: true,
    },
    negativeMarking: { type: Number, default: 0, min: 0 },
    instructions: { type: String },
    hasSubSections: { type: Boolean, default: false },
    subSections: [
      {
        name: { type: String },
        questions: { type: Number, min: 0 },
        marksPerQuestion: { type: Number, min: 0 },
      },
    ],
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    sectionIndex: { type: Number, required: true },
    questionNumber: { type: Number, required: true },
    questionText: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["mcq", "descriptive", "truefalse", "fillblank", "practical"],
      required: true,
    },
    marks: { type: Number, required: true, min: 0 },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed },
    answerKey: { type: String },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    topic: { type: String },
    subTopic: { type: String },
    hasImage: { type: Boolean, default: false },
    imageUrl: { type: String },
    hasAttachment: { type: Boolean, default: false },
    attachmentUrl: { type: String },
    isCompulsory: { type: Boolean, default: true },
    timeLimit: { type: Number, min: 0 },
  },
  { _id: false }
);

const StudentResultSchema = new Schema<IStudentResult>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rollNumber: { type: String, required: true },
    obtainedMarks: { type: Number, required: true, min: 0 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    grade: { type: String, required: true },
    rank: { type: Number },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        studentAnswer: { type: Schema.Types.Mixed },
        marksObtained: { type: Number, min: 0 },
        isCorrect: { type: Boolean },
        evaluatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        evaluationDate: { type: Date },
        remarks: { type: String },
      },
    ],
    status: {
      type: String,
      enum: [
        "absent",
        "present",
        "disqualified",
        "recheck_requested",
        "rechecked",
      ],
      default: "present",
    },
    attendanceStatus: {
      type: String,
      enum: ["present", "absent", "late", "leave"],
      default: "present",
    },
    submittedAt: { type: Date },
    evaluatedAt: { type: Date },
    recheckRequested: { type: Boolean, default: false },
    recheckReason: { type: String },
  },
  { _id: false }
);

/* =========================
   MAIN SCHEMA
========================= */
const ExamSchema = new Schema<IExam, IExamModel>(
  {
    // Basic Information
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    batch: { type: String },
    academicYear: { type: String, required: true },
    term: {
      type: String,
      enum: ["first", "second", "final", "unit", "mid", "preboard"],
      required: true,
    },
    examType: {
      type: String,
      enum: ["theory", "practical", "oral", "viva", "project", "combined"],
      default: "theory",
    },
    category: {
      type: String,
      enum: ["regular", "supplementary", "improvement", "re-test"],
      default: "regular",
    },

    // Schedule & Duration
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true, min: 1 },
    reportingTime: { type: String },
    lateEntryAllowed: { type: Boolean, default: false },
    lateEntryDuration: { type: Number, min: 0 },
    isOnline: { type: Boolean, default: false },
    examMode: {
      type: String,
      enum: ["offline", "online", "hybrid"],
      default: "offline",
    },

    // Location
    venue: { type: String },
    room: { type: String },
    lab: { type: String },
    seatPlan: [
      {
        rollNumber: { type: String },
        seatNumber: { type: String },
        room: { type: String },
      },
    ],

    // Marks & Evaluation
    totalMarks: { type: Number, required: true, min: 1 },
    passingMarks: { type: Number, required: true, min: 0 },
    theoryMarks: { type: Number, min: 0 },
    practicalMarks: { type: Number, min: 0 },
    internalMarks: { type: Number, min: 0 },
    externalMarks: { type: Number, min: 0 },
    hasNegativeMarking: { type: Boolean, default: false },
    negativeMarksPerQuestion: { type: Number, min: 0 },
    gradingSystem: {
      type: String,
      enum: ["percentage", "cgpa", "grades"],
      default: "percentage",
    },
    gradeScale: [
      {
        minPercentage: { type: Number, min: 0, max: 100 },
        maxPercentage: { type: Number, min: 0, max: 100 },
        grade: { type: String },
        gradePoint: { type: Number, min: 0 },
      },
    ],

    // Question Paper Structure
    totalQuestions: { type: Number, required: true, min: 1 },
    sections: [SectionSchema],
    questions: [QuestionSchema],
    questionBankId: { type: Schema.Types.ObjectId, ref: "QuestionBank" },
    hasSections: { type: Boolean, default: false },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard", "mixed"],
      default: "medium",
    },
    blueprint: {
      topics: [
        {
          topic: { type: String },
          questions: { type: Number, min: 0 },
          marks: { type: Number, min: 0 },
          weightage: { type: Number, min: 0, max: 100 },
        },
      ],
    },

    // Rules & Instructions
    instructions: [{ type: String }],
    allowedMaterials: [{ type: String }],
    prohibitedItems: [{ type: String }],
    specialInstructions: { type: String },
    calculatorAllowed: { type: Boolean, default: false },
    extraSheetAllowed: { type: Boolean, default: true },
    roughWorkAllowed: { type: Boolean, default: true },
    mobilePolicy: {
      type: String,
      enum: ["strictly_prohibited", "silent_mode", "allowed"],
      default: "strictly_prohibited",
    },

    // Access & Registration
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    requireRegistration: { type: Boolean, default: true },
    registrationStartDate: { type: Date },
    registrationEndDate: { type: Date },
    maxStudents: { type: Number, min: 1 },
    registeredStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    registrationStatus: {
      type: String,
      enum: ["open", "closed", "pending"],
      default: "pending",
    },

    // Invigilation & Supervision
    chiefInvigilator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invigilators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    externalExaminer: { type: Schema.Types.ObjectId, ref: "User" },
    supervisor: { type: Schema.Types.ObjectId, ref: "User" },
    attendanceVerifiedBy: { type: Schema.Types.ObjectId, ref: "User" },

    // Results & Evaluation
    resultsPublished: { type: Boolean, default: false },
    resultsPublishedAt: { type: Date },
    evaluationStartDate: { type: Date },
    evaluationEndDate: { type: Date },
    answerKeyPublished: { type: Boolean, default: false },
    answerKeyPublishedAt: { type: Date },
    allowResultView: { type: Boolean, default: true },
    allowAnswerReview: { type: Boolean, default: false },
    allowRecheckRequest: { type: Boolean, default: false },
    recheckLastDate: { type: Date },
    graceMarks: { type: Number, default: 0, min: 0 },

    // Student Data
    totalRegistered: { type: Number, default: 0, min: 0 },
    totalAppeared: { type: Number, default: 0, min: 0 },
    totalPassed: { type: Number, default: 0, min: 0 },
    totalFailed: { type: Number, default: 0, min: 0 },
    averagePercentage: { type: Number, min: 0, max: 100 },
    highestMarks: { type: Number, min: 0 },
    lowestMarks: { type: Number, min: 0 },
    studentResults: [StudentResultSchema],
    toppers: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: "User" },
        rank: { type: Number },
        marks: { type: Number },
      },
    ],

    // Status & Tracking
    status: {
      type: String,
      enum: ["draft", "scheduled", "ongoing", "completed", "cancelled", "postponed"],
      default: "draft",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancelledReason: { type: String },
    postponedDate: { type: Date },
    postponedReason: { type: String },

    // Technical & Online Exam Fields
    platform: {
      type: String,
      enum: ["google_forms", "moodle", "custom", "offline"],
    },
    examLink: { type: String },
    meetingId: { type: String },
    passcode: { type: String },
    technologyRequirements: [{ type: String }],
    technicalSupportContact: { type: String },
    systemCheckRequired: { type: Boolean, default: false },

    // Soft delete
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* =========================
   VIRTUALS (FIXED)
========================= */

// Remaining time (ms)
ExamSchema.virtual("timeRemaining").get(function (this: IExam) {
  if (this.status !== "scheduled") return null;

  const examDateTime = new Date(this.date);

  const start = this.startTime || "00:00";
  const [hours, minutes] = start.split(":").map(Number);

  examDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  return examDateTime.getTime() - now.getTime();
});

// Registration open?
ExamSchema.virtual("isRegistrationOpen").get(function (this: IExam) {
  if (!this.requireRegistration) return false;

  const now = new Date();
  const start = this.registrationStartDate || new Date(0);
  const end = this.registrationEndDate || new Date("9999-12-31");

  return now >= start && now <= end && this.registrationStatus === "open";
});

// Auto status
ExamSchema.virtual("autoStatus").get(function (this: IExam) {
  const now = new Date();
  const examDate = new Date(this.date);

  const start = this.startTime || "00:00";
  const end = this.endTime || "00:00";

  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  const examStart = new Date(examDate);
  examStart.setHours(startHours, startMinutes, 0, 0);

  const examEnd = new Date(examDate);
  examEnd.setHours(endHours, endMinutes, 0, 0);

  if (now < examStart) return "scheduled";
  if (now >= examStart && now <= examEnd) return "ongoing";
  return "completed";
});

/* =========================
   INDEXES
========================= */
ExamSchema.index({ code: 1 }, { unique: true });
ExamSchema.index({ subjectId: 1, classId: 1, academicYear: 1 });
ExamSchema.index({ date: 1, startTime: 1 });
ExamSchema.index({ status: 1 });
ExamSchema.index({ createdBy: 1 });
ExamSchema.index({ isPublished: 1 });
ExamSchema.index({ resultsPublished: 1 });
ExamSchema.index({ "studentResults.studentId": 1 });

/* =========================
   PRE-SAVE MIDDLEWARE (FIXED)
========================= */
ExamSchema.pre("save", async function () {
  // Auto-generate code if not provided
  if (!this.code) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.code = `EXAM-${year}-${random}`;
  }

  // Calculate duration from start and end time if not provided
  if (!this.duration && this.startTime && this.endTime) {
    const [startHour, startMinute] = this.startTime.split(":").map(Number);
    const [endHour, endMinute] = this.endTime.split(":").map(Number);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    let duration = endTotal - startTotal;
    if (duration < 0) duration += 24 * 60;

    this.duration = duration;
  }

  // Calculate total marks from sections if sections exist
  if (this.sections && this.sections.length > 0 && !this.totalMarks) {
    this.totalMarks = this.sections.reduce(
      (sum: number, section: any) =>
        sum + section.totalQuestions * section.marksPerQuestion,
      0
    );
  }

  // Set passing marks if not provided (default 33%)
  if (!this.passingMarks && this.totalMarks) {
    this.passingMarks = Math.ceil(this.totalMarks * 0.33);
  }
});

/* =========================
   STATIC METHODS
========================= */
ExamSchema.statics.findUpcoming = function (days = 7) {
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + days);

  return this.find({
    date: { $gte: now, $lte: future },
    status: "scheduled",
  }).sort({ date: 1, startTime: 1 });
};

ExamSchema.statics.getStatistics = async function (examId: string) {
  const exam = await this.findById(examId).populate("studentResults.studentId");

  if (!exam) return null;

  const stats = {
    totalStudents: exam.totalRegistered,
    appeared: exam.totalAppeared,
    passed: exam.totalPassed,
    failed: exam.totalFailed,
    passPercentage:
      exam.totalAppeared > 0 ? (exam.totalPassed / exam.totalAppeared) * 100 : 0,
    averageMarks: 0,
    highestMarks: exam.highestMarks || 0,
    lowestMarks: exam.lowestMarks || 0,
    subjectAverage: exam.averagePercentage || 0,
  };

  if (exam.studentResults && exam.studentResults.length > 0) {
    const totalMarks = exam.studentResults.reduce(
      (sum: number, result: any) => sum + (result.obtainedMarks || 0),
      0
    );
    stats.averageMarks = totalMarks / exam.studentResults.length;
  }

  return stats;
};

/* =========================
   INSTANCE METHODS
========================= */
ExamSchema.methods.publishExam = function (this: IExam) {
  this.isPublished = true;
  this.publishedAt = new Date();
  this.status = "scheduled";
  this.registrationStatus = "open";
  return this.save();
};

ExamSchema.methods.addStudentResult = async function (this: IExam, studentResult: any) {
  this.studentResults.push(studentResult);

  this.totalAppeared += 1;
  if (studentResult?.obtainedMarks >= this.passingMarks) {
    this.totalPassed += 1;
  } else {
    this.totalFailed += 1;
  }

  if (!this.highestMarks || studentResult?.obtainedMarks > this.highestMarks) {
    this.highestMarks = studentResult.obtainedMarks;
  }
  if (!this.lowestMarks || studentResult?.obtainedMarks < this.lowestMarks) {
    this.lowestMarks = studentResult.obtainedMarks;
  }

  return this.save();
};

ExamSchema.methods.publishResults = function (this: IExam) {
  this.resultsPublished = true;
  this.resultsPublishedAt = new Date();

  if (this.studentResults && this.studentResults.length > 0) {
    const totalPercentage = this.studentResults.reduce(
      (sum: number, result: any) => sum + (result.percentage || 0),
      0
    );
    this.averagePercentage = totalPercentage / this.studentResults.length;
  }

  return this.save();
};

/* =========================
   EXPORT MODEL (NEXT SAFE)
========================= */
const Exam =
  (mongoose.models.Exam as IExamModel) ||
  mongoose.model<IExam, IExamModel>("Exam", ExamSchema);

export default Exam;
