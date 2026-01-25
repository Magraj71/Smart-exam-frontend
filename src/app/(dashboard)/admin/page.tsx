"use client";

import { useState } from "react";
import { 
  Users, 
  FileText, 
  BarChart3, 
  Calendar, 
  Shield,
  TrendingUp,
  AlertCircle,
  Download,
  Plus
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeExams: 12,
    pendingResults: 45,
    systemHealth: 98.5
  });

  const recentActivities = [
    { id: 1, action: "New teacher registered", user: "John Smith", time: "10 min ago" },
    { id: 2, action: "Exam created", exam: "Final Mathematics", time: "1 hour ago" },
    { id: 3, action: "System backup completed", time: "2 hours ago" },
    { id: 4, action: "User permissions updated", user: "3 teachers", time: "3 hours ago" },
  ];

  const quickActions = [
    { icon: <Users className="h-5 w-5" />, label: "Add New User", href: "/admin/users/create" },
    { icon: <FileText className="h-5 w-5" />, label: "Create Exam", href: "/admin/exams/create" },
    { icon: <Calendar className="h-5 w-5" />, label: "Schedule Exams", href: "/admin/exams/schedule" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "View Reports", href: "/admin/analytics" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your institution's exams, users, and system settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white hover:opacity-90">
            <Download className="h-4 w-4" />
            Export Reports
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <Plus className="h-4 w-4" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Exams</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.activeExams}
              </p>
            </div>
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-600">8 running</span>, 4 scheduled
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Results</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.pendingResults}
              </p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Need evaluation
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.systemHealth}%
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            All systems operational
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg p-3 text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                    {action.icon}
                  </div>
                  <span className="font-medium">{action.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.user || activity.exam || "System"}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            User Growth
          </h2>
          <div className="h-64">
            {/* Chart placeholder */}
            <div className="flex h-full items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Exam Statistics */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Exam Statistics
          </h2>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-full w-3/4 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ongoing</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-full w-1/6 rounded-full bg-blue-500"></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Scheduled</span>
                <span className="font-medium">7%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-full w-1/12 rounded-full bg-purple-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}