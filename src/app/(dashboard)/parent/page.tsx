"use client";

import { useState } from "react";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  AlertCircle,
  MessageSquare,
  Bell
} from "lucide-react";

export default function ParentDashboard() {
  const [children, setChildren] = useState([
    { id: 1, name: "John Doe", grade: "10th", attendance: 95, averageScore: 85.5 },
    { id: 2, name: "Jane Smith", grade: "8th", attendance: 88, averageScore: 78.2 },
  ]);

  const recentActivities = [
    { id: 1, child: "John Doe", action: "Maths exam completed", time: "Yesterday", score: 85 },
    { id: 2, child: "Jane Smith", action: "Science project submitted", time: "2 days ago" },
    { id: 3, child: "John Doe", action: "Low attendance warning", time: "3 days ago" },
    { id: 4, child: "Both", action: "Parent-teacher meeting scheduled", time: "1 week ago" },
  ];

  const upcomingEvents = [
    { id: 1, event: "Maths Exam", child: "John Doe", date: "Dec 15", time: "10:00 AM" },
    { id: 2, event: "Parent-Teacher Meeting", child: "Both", date: "Dec 18", time: "2:00 PM" },
    { id: 3, event: "Science Fair", child: "Jane Smith", date: "Dec 20", time: "9:00 AM" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Parent Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your children's academic progress and activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white hover:opacity-90">
            <MessageSquare className="h-4 w-4" />
            Contact Teacher
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <Bell className="h-4 w-4" />
            Notifications
          </button>
        </div>
      </div>

      {/* Children Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {children.map((child) => (
          <div key={child.id} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {child.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Grade {child.grade}
                  </p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                View Details
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {child.attendance}%
                    </p>
                  </div>
                  <div className={`rounded-full p-2 ${
                    child.attendance >= 90 ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-orange-100 dark:bg-orange-900/30'
                  }`}>
                    <Award className={`h-5 w-5 ${
                      child.attendance >= 90 ? 'text-green-600 dark:text-green-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`} />
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                  <div 
                    className={`h-full rounded-full ${
                      child.attendance >= 90 ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${child.attendance}%` }}
                  ></div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {child.averageScore}%
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                  <div 
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${child.averageScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
                View Results
              </button>
              <button className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                View Attendance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {activity.child}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.time}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {activity.action}
                  </p>
                  {activity.score && (
                    <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Score: {activity.score}%
                    </div>
                  )}
                </div>
                {activity.action.includes("warning") && (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
              View Calendar
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {event.event}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {event.child} • {event.date} at {event.time}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Important
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                    Add to Calendar
                  </button>
                  <button className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Set Reminder
                  </button>
                </div>
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
            href="/parent/results"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <FileText className="mb-3 h-8 w-8 text-blue-600" />
            <span className="font-medium">View Results</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Exam scores
            </span>
          </a>
          <a
            href="/parent/attendance"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <Calendar className="mb-3 h-8 w-8 text-green-600" />
            <span className="font-medium">Attendance</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track presence
            </span>
          </a>
          <a
            href="/parent/messages"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <MessageSquare className="mb-3 h-8 w-8 text-purple-600" />
            <span className="font-medium">Messages</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Contact teachers
            </span>
          </a>
          <a
            href="/parent/fees"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <TrendingUp className="mb-3 h-8 w-8 text-orange-600" />
            <span className="font-medium">Fee Status</span>
            <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View dues
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}