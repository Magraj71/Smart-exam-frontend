"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Users, BookOpen, Target,
  PieChart, LineChart, Filter, Download, Calendar,
  ChevronDown, Award, Trophy, Star, TrendingDown,
  CheckCircle, XCircle, Clock, Activity, DollarSign,
  Eye, RefreshCw, Settings, MoreVertical
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalExams: number;
    averageAttendance: number;
  };
  performance: {
    subjectWise: Array<{
      subject: string;
      averageScore: number;
      passPercentage: number;
      totalStudents: number;
    }>;
    classWise: Array<{
      class: string;
      averagePercentage: number;
      topScore: number;
      students: number;
    }>;
  };
  trends: {
    monthlyResults: Array<{
      month: string;
      passed: number;
      failed: number;
      averagePercentage: number;
    }>;
    attendanceTrend: Array<{
      month: string;
      attendance: number;
    }>;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, selectedClass, selectedSubject]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/analytics?range=${timeRange}&class=${selectedClass}&subject=${selectedSubject}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Insights and performance metrics for your institution
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Overview Stats */}
        {data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {data.overview.totalStudents}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+5.2% from last month</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Teachers</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {data.overview.totalTeachers}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                92% active this month
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Exams Conducted</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {data.overview.totalExams}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                8 upcoming exams
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {data.overview.averageAttendance}%
                  </p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                  <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+2.1% improvement</span>
              </div>
            </div>
          </div>
        )}

        {/* Performance Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Subject-wise Performance */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Subject-wise Performance
              </h3>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="space-y-4">
              {data?.performance.subjectWise.map((subject, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{subject.subject}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subject.totalStudents} students
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getPerformanceColor(subject.averageScore)}`}>
                        {subject.averageScore}%
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Pass: {subject.passPercentage}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{ width: `${subject.averageScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class-wise Performance */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Class-wise Performance
              </h3>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Classes</option>
                <option value="8th">8th Grade</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
            </div>

            <div className="space-y-4">
              {data?.performance.classWise.map((classData, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{classData.class}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {classData.students} students
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {classData.averagePercentage}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Top: {classData.topScore}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Trends */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Monthly Results */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Results Trend
            </h3>
            <div className="space-y-4">
              {data?.trends.monthlyResults.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900 dark:text-white">{month.month}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-600">{month.passed}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-600">{month.failed}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">{month.averagePercentage}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Attendance Trend
            </h3>
            <div className="space-y-4">
              {data?.trends.attendanceTrend.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900 dark:text-white">{trend.month}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <div className="flex h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                          style={{ width: `${trend.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {trend.attendance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}