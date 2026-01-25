"use client";

import { useState } from "react";
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 85,
    pendingEvaluations: 12,
    upcomingExams: 3,
    averageScore: 78.5
  });

  const upcomingExams = [
    { id: 1, subject: "Mathematics", date: "Dec 15, 2023", time: "10:00 AM", duration: "3 hours" },
    { id: 2, subject: "Physics", date: "Dec 18, 2023", time: "2:00 PM", duration: "2 hours" },
    { id: 3, subject: "Computer Science", date: "Dec 20, 2023", time: "9:00 AM", duration: "3 hours" },
  ];

  const toEvaluate = [
    { id: 1, student: "John Doe", subject: "Mathematics", submitted: "2 days ago" },
    { id: 2, student: "Jane Smith", subject: "Physics", submitted: "1 day ago" },
    { id: 3, student: "Bob Johnson", subject: "Chemistry", submitted: "Today" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teacher Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your classes, exams, and student evaluations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white hover:opacity-90">
            <Plus className="h-4 w-4" />
            Create Exam
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <BookOpen className="h-4 w-4" />
            Add Material
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalStudents}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Across 4 classes
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Evaluations</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.pendingEvaluations}
              </p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Need your attention
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Exams</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.upcomingExams}
              </p>
            </div>
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            In next 7 days
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.averageScore}%
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            +5.2% from last term
          </div>
        </div>
      </div>

      {/* Upcoming Exams & To Evaluate */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Exams */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Exams
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <div
                key={exam.id}
                className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {exam.subject}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {exam.date} • {exam.time}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {exam.duration}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                    View Details
                  </button>
                  <button className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Prepare Paper
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* To Evaluate */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              To Evaluate
            </h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              Urgent
            </span>
          </div>
          <div className="space-y-4">
            {toEvaluate.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {item.subject}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.student}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Submitted: {item.submitted}
                  </p>
                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Evaluate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/teacher/question-bank"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <BookOpen className="mb-3 h-8 w-8 text-blue-600" />
            <span className="font-medium">Question Bank</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              250+ questions
            </span>
          </a>
          <a
            href="/teacher/students"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <Users className="mb-3 h-8 w-8 text-green-600" />
            <span className="font-medium">Students</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage students
            </span>
          </a>
          <a
            href="/teacher/attendance"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <CheckCircle className="mb-3 h-8 w-8 text-purple-600" />
            <span className="font-medium">Attendance</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Mark today
            </span>
          </a>
          <a
            href="/teacher/reports"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <FileText className="mb-3 h-8 w-8 text-orange-600" />
            <span className="font-medium">Reports</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Generate reports
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}