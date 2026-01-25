"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  Download
} from "lucide-react";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    averageScore: 82.5,
    attendance: 94.2,
    pendingAssignments: 2,
    upcomingExams: 3
  });

  const upcomingExams = [
    { id: 1, subject: "Mathematics", date: "Dec 15", time: "10:00 AM", preparation: 75 },
    { id: 2, subject: "Physics", date: "Dec 18", time: "2:00 PM", preparation: 60 },
    { id: 3, subject: "Computer Science", date: "Dec 20", time: "9:00 AM", preparation: 90 },
  ];

  const recentResults = [
    { id: 1, subject: "Chemistry", score: 85, maxScore: 100, grade: "A" },
    { id: 2, subject: "Biology", score: 78, maxScore: 100, grade: "B+" },
    { id: 3, subject: "English", score: 92, maxScore: 100, grade: "A+" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here's your academic overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white hover:opacity-90">
            <Download className="h-4 w-4" />
            Download Report
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <Calendar className="h-4 w-4" />
            View Calendar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.averageScore}%
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            +3.2% from last term
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.attendance}%
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Above 90% required
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Assignments</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.pendingAssignments}
              </p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Due this week
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
      </div>

      {/* Upcoming Exams & Recent Results */}
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
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {exam.preparation}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Prepared
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Preparation</span>
                    <span>{exam.preparation}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div 
                      className={`h-full rounded-full ${
                        exam.preparation >= 80 ? 'bg-green-500' :
                        exam.preparation >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${exam.preparation}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                    Study Material
                  </button>
                  <button className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Practice Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Results
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                    result.grade === 'A+' ? 'bg-green-100 dark:bg-green-900/30' :
                    result.grade === 'A' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    <FileText className={`h-6 w-6 ${
                      result.grade === 'A+' ? 'text-green-600 dark:text-green-400' :
                      result.grade === 'A' ? 'text-blue-600 dark:text-blue-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {result.subject}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Score: {result.score}/{result.maxScore}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    result.grade === 'A+' ? 'text-green-600' :
                    result.grade === 'A' ? 'text-blue-600' :
                    'text-purple-600'
                  }`}>
                    {result.grade}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Grade
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Quick Access
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/student/timetable"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <Calendar className="mb-3 h-8 w-8 text-blue-600" />
            <span className="font-medium">Timetable</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View schedule
            </span>
          </a>
          <a
            href="/student/materials"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <BookOpen className="mb-3 h-8 w-8 text-green-600" />
            <span className="font-medium">Study Materials</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Access resources
            </span>
          </a>
          <a
            href="/student/assignments"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <FileText className="mb-3 h-8 w-8 text-purple-600" />
            <span className="font-medium">Assignments</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Submit work
            </span>
          </a>
          <a
            href="/student/performance"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <TrendingUp className="mb-3 h-8 w-8 text-orange-600" />
            <span className="font-medium">Performance</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track progress
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}