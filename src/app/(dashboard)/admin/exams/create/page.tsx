"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft, Save, Plus, X, Calendar, Clock,
  Users, FileText, BookOpen, Building, Hash,
  Tag, AlertCircle, HelpCircle, Upload, Download,
  Eye, EyeOff, Globe, Lock, Unlock,FileClock, Check,
  ChevronDown, ChevronUp, Calculator, Clock3,
  CalendarDays, Target, Star, Shield, Zap,
  Settings, Copy, Trash2, Link, QrCode,
  FileBarChart, FileDigit, FileQuestion,
  ClipboardList, NotebookPen, Brain,
  UsersRound, BookOpenCheck, FileCheck
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher?: string;
}

interface Class {
  id: string;
  name: string;
  section?: string;
  studentsCount: number;
}

interface QuestionType {
  id: string;
  name: string;
  description: string;
}

interface ExamFormData {
  basicInfo: {
    title: string;
    code: string;
    description: string;
    subjectId: string;
    classId: string;
    academicYear: string;
    term: "first" | "second" | "final";
  };
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    isOnline: boolean;
    venue?: string;
    room?: string;
    invigilators: string[];
  };
  marks: {
    totalMarks: number;
    passingMarks: number;
    negativeMarking: boolean;
    negativeMarksPerQuestion: number;
    hasPractical: boolean;
    practicalMarks?: number;
    theoryMarks?: number;
  };
  questions: {
    totalQuestions: number;
    questionTypes: string[];
    difficulty: "easy" | "medium" | "hard";
    hasSections: boolean;
    sections?: Array<{
      name: string;
      questions: number;
      marks: number;
      type: string;
    }>;
  };
  rules: {
    instructions: string;
    allowedMaterials: string[];
    prohibitedItems: string[];
    lateSubmissionPolicy: string;
    specialInstructions?: string;
  };
  access: {
    isPublished: boolean;
    allowResultView: boolean;
    allowReview: boolean;
    showAnswersAfterExam: boolean;
    requireRegistration: boolean;
    registrationDeadline?: string;
  };
}

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [questionTypes] = useState<QuestionType[]>([
    { id: "mcq", name: "Multiple Choice", description: "Choose correct option" },
    { id: "written", name: "Written", description: "Descriptive answers" },
    { id: "truefalse", name: "True/False", description: "True or false questions" },
    { id: "fillblank", name: "Fill in Blanks", description: "Fill missing words" },
    { id: "short", name: "Short Answer", description: "Brief answers" },
    { id: "long", name: "Long Answer", description: "Detailed answers" },
    { id: "practical", name: "Practical", description: "Hands-on tasks" },
  ]);

  const [formData, setFormData] = useState<ExamFormData>({
    basicInfo: {
      title: "",
      code: "",
      description: "",
      subjectId: "",
      classId: "",
      academicYear: new Date().getFullYear().toString(),
      term: "final"
    },
    schedule: {
      date: new Date().toISOString().split('T')[0],
      startTime: "10:00",
      endTime: "13:00",
      duration: 180,
      isOnline: false,
      venue: "",
      room: "",
      invigilators: []
    },
    marks: {
      totalMarks: 100,
      passingMarks: 33,
      negativeMarking: false,
      negativeMarksPerQuestion: 0.25,
      hasPractical: false,
      practicalMarks: 0,
      theoryMarks: 100
    },
    questions: {
      totalQuestions: 25,
      questionTypes: ["mcq", "written"],
      difficulty: "medium",
      hasSections: false,
      sections: []
    },
    rules: {
      instructions: "1. All questions are compulsory.\n2. Write your answers clearly.\n3. Use black/blue pen only.\n4. Calculators are allowed.\n5. Mobile phones are strictly prohibited.",
      allowedMaterials: ["Calculator", "Geometry Box", "Log Tables"],
      prohibitedItems: ["Mobile Phone", "Smart Watch", "Electronic Devices"],
      lateSubmissionPolicy: "No submissions after time limit",
      specialInstructions: ""
    },
    access: {
      isPublished: false,
      allowResultView: true,
      allowReview: false,
      showAnswersAfterExam: true,
      requireRegistration: true,
      registrationDeadline: ""
    }
  });

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchSubjects = async () => {
    try {
      // Mock data - Replace with actual API call
      const mockSubjects = [
        { id: "1", name: "Mathematics", code: "MATH101", teacher: "Dr. Sharma" },
        { id: "2", name: "Physics", code: "PHYS101", teacher: "Prof. Kumar" },
        { id: "3", name: "Chemistry", code: "CHEM101", teacher: "Dr. Singh" },
        { id: "4", name: "Biology", code: "BIO101", teacher: "Mrs. Patel" },
        { id: "5", name: "English", code: "ENG101", teacher: "Mr. Johnson" },
        { id: "6", name: "Computer Science", code: "CS101", teacher: "Ms. Gupta" },
      ];
      setSubjects(mockSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      // Mock data - Replace with actual API call
      const mockClasses = [
        { id: "1", name: "8th Grade", studentsCount: 45 },
        { id: "2", name: "9th Grade", studentsCount: 52 },
        { id: "3", name: "10th Grade", studentsCount: 48 },
        { id: "4", name: "11th Science", studentsCount: 38 },
        { id: "5", name: "12th Science", studentsCount: 42 },
        { id: "6", name: "12th Commerce", studentsCount: 35 },
      ];
      setClasses(mockClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleInputChange = (section: keyof ExamFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section: keyof ExamFormData, subSection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...(prev[section] as any)[subSection],
          [field]: value
        }
      }
    }));
  };

  const handleQuestionTypeToggle = (typeId: string) => {
    setFormData(prev => {
      const currentTypes = [...prev.questions.questionTypes];
      if (currentTypes.includes(typeId)) {
        return {
          ...prev,
          questions: {
            ...prev.questions,
            questionTypes: currentTypes.filter(t => t !== typeId)
          }
        };
      } else {
        return {
          ...prev,
          questions: {
            ...prev.questions,
            questionTypes: [...currentTypes, typeId]
          }
        };
      }
    });
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        sections: [
          ...(prev.questions.sections || []),
          { name: "", questions: 0, marks: 0, type: "mcq" }
        ]
      }
    }));
  };

  const updateSection = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newSections = [...(prev.questions.sections || [])];
      newSections[index] = { ...newSections[index], [field]: value };
      return {
        ...prev,
        questions: {
          ...prev.questions,
          sections: newSections
        }
      };
    });
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        sections: (prev.questions.sections || []).filter((_, i) => i !== index)
      }
    }));
  };

  const calculateDuration = () => {
    const [startHour, startMinute] = formData.schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = formData.schedule.endTime.split(':').map(Number);
    
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    
    let duration = endTotal - startTotal;
    if (duration < 0) duration += 24 * 60;
    
    handleInputChange("schedule", "duration", duration);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call to create exam
      const response = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/exams/${data.id}`);
      } else {
        throw new Error("Failed to create exam");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Error creating exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveAsDraft = async () => {
    setLoading(true);
    
    try {
      const draftData = { ...formData, access: { ...formData.access, isPublished: false } };
      
      const response = await fetch("/api/admin/exams/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftData)
      });
      
      if (response.ok) {
        router.push("/admin/exams");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", icon: <FileText className="h-4 w-4" /> },
    { number: 2, title: "Schedule & Venue", icon: <Calendar className="h-4 w-4" /> },
    { number: 3, title: "Marks & Rules", icon: <Calculator className="h-4 w-4" /> },
    { number: 4, title: "Question Paper", icon: <BookOpen className="h-4 w-4" /> },
    { number: 5, title: "Access & Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                  Create New Exam
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Fill in the details to create a new examination
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={saveAsDraft}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <FileClock className="h-4 w-4" />
                Save as Draft
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Exam
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.number)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                    activeStep === step.number
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    activeStep === step.number
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800"
                  }`}>
                    {step.icon}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-medium">Step {step.number}</p>
                    <p className="text-sm">{step.title}</p>
                  </div>
                </button>
                
                {index < steps.length - 1 && (
                  <div className="hidden h-0.5 w-12 bg-gray-200 sm:block dark:bg-gray-700"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {activeStep === 1 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter exam title, subject, and class details
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    value={formData.basicInfo.title}
                    onChange={(e) => handleInputChange("basicInfo", "title", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Mathematics Final Examination 2024"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Exam Code *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.basicInfo.code}
                        onChange={(e) => handleInputChange("basicInfo", "code", e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        placeholder="e.g., MATH-FINAL-2024"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange("basicInfo", "code", `EXAM-${Date.now().toString().slice(-6)}`)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      >
                        <Hash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Academic Year *
                    </label>
                    <select
                      value={formData.basicInfo.academicYear}
                      onChange={(e) => handleInputChange("basicInfo", "academicYear", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      required
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year.toString()}>
                            {year} - {year + 1}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject *
                    </label>
                    <select
                      value={formData.basicInfo.subjectId}
                      onChange={(e) => handleInputChange("basicInfo", "subjectId", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Class *
                    </label>
                    <select
                      value={formData.basicInfo.classId}
                      onChange={(e) => handleInputChange("basicInfo", "classId", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.studentsCount} students)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Term *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["first", "second", "final"] as const).map(term => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleInputChange("basicInfo", "term", term)}
                        className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                          formData.basicInfo.term === term
                            ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {term.charAt(0).toUpperCase() + term.slice(1)} Term
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={formData.basicInfo.description}
                    onChange={(e) => handleInputChange("basicInfo", "description", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Brief description about the exam..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Next: Schedule
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Schedule & Venue */}
          {activeStep === 2 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Schedule & Venue
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set date, time, and location for the exam
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Exam Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        type="date"
                        value={formData.schedule.date}
                        onChange={(e) => handleInputChange("schedule", "date", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Exam Type
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange("schedule", "isOnline", false)}
                        className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                          !formData.schedule.isOnline
                            ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        Offline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange("schedule", "isOnline", true)}
                        className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                          formData.schedule.isOnline
                            ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        Online
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        type="time"
                        value={formData.schedule.startTime}
                        onChange={(e) => {
                          handleInputChange("schedule", "startTime", e.target.value);
                          calculateDuration();
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Time *
                    </label>
                    <div className="relative">
                      <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        type="time"
                        value={formData.schedule.endTime}
                        onChange={(e) => {
                          handleInputChange("schedule", "endTime", e.target.value);
                          calculateDuration();
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Duration
                  </label>
                  <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formData.schedule.duration} minutes
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.floor(formData.schedule.duration / 60)} hours {formData.schedule.duration % 60} minutes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formData.schedule.startTime} - {formData.schedule.endTime}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Auto-calculated from times
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {!formData.schedule.isOnline && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={formData.schedule.venue}
                        onChange={(e) => handleInputChange("schedule", "venue", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        placeholder="e.g., Main Campus Building"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Room Number
                      </label>
                      <input
                        type="text"
                        value={formData.schedule.room}
                        onChange={(e) => handleInputChange("schedule", "room", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        placeholder="e.g., Room 101"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Invigilators
                  </label>
                  <div className="space-y-2">
                    {formData.schedule.invigilators.map((invigilator, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={invigilator}
                          onChange={(e) => {
                            const newInvigilators = [...formData.schedule.invigilators];
                            newInvigilators[index] = e.target.value;
                            handleInputChange("schedule", "invigilators", newInvigilators);
                          }}
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          placeholder="Invigilator name"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newInvigilators = formData.schedule.invigilators.filter((_, i) => i !== index);
                            handleInputChange("schedule", "invigilators", newInvigilators);
                          }}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleInputChange("schedule", "invigilators", [...formData.schedule.invigilators, ""])}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      <Plus className="h-4 w-4" />
                      Add Invigilator
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Next: Marks & Rules
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Marks & Rules */}
          {activeStep === 3 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Marks & Rules
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure marks distribution and exam rules
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      value={formData.marks.totalMarks}
                      onChange={(e) => handleInputChange("marks", "totalMarks", parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Passing Marks *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.marks.passingMarks}
                        onChange={(e) => handleInputChange("marks", "passingMarks", parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        min="0"
                        max={formData.marks.totalMarks}
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        ({((formData.marks.passingMarks / formData.marks.totalMarks) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Has Practical Component?
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Enable if exam includes practical assessment
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formData.marks.hasPractical}
                        onChange={(e) => handleInputChange("marks", "hasPractical", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                    </label>
                  </div>

                  {formData.marks.hasPractical && (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                          Practical Marks
                        </label>
                        <input
                          type="number"
                          value={formData.marks.practicalMarks}
                          onChange={(e) => {
                            const practical = parseInt(e.target.value) || 0;
                            const theory = formData.marks.totalMarks - practical;
                            handleNestedChange("marks", "total", "theoryMarks", theory);
                            handleNestedChange("marks", "total", "practicalMarks", practical);

                          }}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          max={formData.marks.totalMarks}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                          Theory Marks
                        </label>
                        <input
                          type="number"
                          value={formData.marks.theoryMarks}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Negative Marking
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Deduct marks for wrong answers
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formData.marks.negativeMarking}
                        onChange={(e) => handleInputChange("marks", "negativeMarking", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                    </label>
                  </div>

                  {formData.marks.negativeMarking && (
                    <div className="mt-4">
                      <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                        Deduct per wrong answer
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={formData.marks.negativeMarksPerQuestion}
                          onChange={(e) => handleInputChange("marks", "negativeMarksPerQuestion", parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0"
                          max="1"
                          className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">marks</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exam Instructions *
                  </label>
                  <textarea
                    value={formData.rules.instructions}
                    onChange={(e) => handleInputChange("rules", "instructions", e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allowed Materials
                    </label>
                    <div className="space-y-2">
                      {formData.rules.allowedMaterials.map((material, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={material}
                            onChange={(e) => {
                              const newMaterials = [...formData.rules.allowedMaterials];
                              newMaterials[index] = e.target.value;
                              handleInputChange("rules", "allowedMaterials", newMaterials);
                            }}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="e.g., Calculator"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newMaterials = formData.rules.allowedMaterials.filter((_, i) => i !== index);
                              handleInputChange("rules", "allowedMaterials", newMaterials);
                            }}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleInputChange("rules", "allowedMaterials", [...formData.rules.allowedMaterials, ""])}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        <Plus className="h-4 w-4" />
                        Add Material
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Prohibited Items
                    </label>
                    <div className="space-y-2">
                      {formData.rules.prohibitedItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...formData.rules.prohibitedItems];
                              newItems[index] = e.target.value;
                              handleInputChange("rules", "prohibitedItems", newItems);
                            }}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="e.g., Mobile Phone"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = formData.rules.prohibitedItems.filter((_, i) => i !== index);
                              handleInputChange("rules", "prohibitedItems", newItems);
                            }}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleInputChange("rules", "prohibitedItems", [...formData.rules.prohibitedItems, ""])}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        <Plus className="h-4 w-4" />
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Next: Question Paper
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Question Paper */}
          {activeStep === 4 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Question Paper
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure question types and structure
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Questions *
                    </label>
                    <input
                      type="number"
                      value={formData.questions.totalQuestions}
                      onChange={(e) => handleInputChange("questions", "totalQuestions", parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["easy", "medium", "hard"] as const).map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleInputChange("questions", "difficulty", level)}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                            formData.questions.difficulty === level
                              ? level === "easy"
                                ? "border-green-500 bg-green-50 text-green-600 dark:border-green-400 dark:bg-green-900/30 dark:text-green-400"
                                : level === "medium"
                                ? "border-yellow-500 bg-yellow-50 text-yellow-600 dark:border-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "border-red-500 bg-red-50 text-red-600 dark:border-red-400 dark:bg-red-900/30 dark:text-red-400"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Question Types
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {questionTypes.map(type => (
                      <div
                        key={type.id}
                        onClick={() => handleQuestionTypeToggle(type.id)}
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                          formData.questions.questionTypes.includes(type.id)
                            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30"
                            : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-1.5 ${
                              formData.questions.questionTypes.includes(type.id)
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                              <FileQuestion className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {type.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {type.description}
                              </p>
                            </div>
                          </div>
                          {formData.questions.questionTypes.includes(type.id) ? (
                            <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <div className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Has Sections?
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Divide paper into multiple sections
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formData.questions.hasSections}
                        onChange={(e) => handleInputChange("questions", "hasSections", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                    </label>
                  </div>

                  {formData.questions.hasSections && (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Paper Sections
                        </h4>
                        <button
                          type="button"
                          onClick={addSection}
                          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          <Plus className="h-3 w-3" />
                          Add Section
                        </button>
                      </div>

                      {formData.questions.sections?.map((section, index) => (
                        <div key={index} className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              Section {index + 1}
                            </h5>
                            <button
                              type="button"
                              onClick={() => removeSection(index)}
                              className="rounded-lg p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Section Name
                              </label>
                              <input
                                type="text"
                                value={section.name}
                                onChange={(e) => updateSection(index, "name", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="e.g., Section A"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Questions
                              </label>
                              <input
                                type="number"
                                value={section.questions}
                                onChange={(e) => updateSection(index, "questions", parseInt(e.target.value) || 0)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Marks
                              </label>
                              <input
                                type="number"
                                value={section.marks}
                                onChange={(e) => updateSection(index, "marks", parseInt(e.target.value) || 0)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Question Paper Preview
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Based on your configuration
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white p-3 dark:bg-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Questions</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formData.questions.totalQuestions}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3 dark:bg-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Question Types</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formData.questions.questionTypes.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(5)}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Next: Access & Settings
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Access & Settings */}
          {activeStep === 5 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Access & Settings
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure exam access and result settings
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Publish Exam Immediately
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Students can view and register for the exam
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formData.access.isPublished}
                        onChange={(e) => handleInputChange("access", "isPublished", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                    </label>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Require Registration
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Students must register before appearing
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formData.access.requireRegistration}
                        onChange={(e) => handleInputChange("access", "requireRegistration", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                    </label>
                  </div>

                  {formData.access.requireRegistration && (
                    <div className="mt-4">
                      <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                        Registration Deadline
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.access.registrationDeadline}
                        onChange={(e) => handleInputChange("access", "registrationDeadline", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow Result View
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Students can view their results after publishing
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formData.access.allowResultView}
                        onChange={(e) => handleInputChange("access", "allowResultView", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow Review
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Students can review their answers after exam
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formData.access.allowReview}
                        onChange={(e) => handleInputChange("access", "allowReview", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show Answers After Exam
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Display correct answers after result publication
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formData.access.showAnswersAfterExam}
                        onChange={(e) => handleInputChange("access", "showAnswersAfterExam", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                    </label>
                  </div>
                </div>

                <div className="rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Exam Summary
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Review your exam configuration before creating
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white p-3 dark:bg-gray-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Exam</p>
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {formData.basicInfo.title || "Not set"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3 dark:bg-gray-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Date & Time</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.schedule.date} {formData.schedule.startTime}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3 dark:bg-gray-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.schedule.duration} mins
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3 dark:bg-gray-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Marks</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.marks.totalMarks}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={saveAsDraft}
                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="inline h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                        Creating Exam...
                      </>
                    ) : (
                      "Create Exam"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}