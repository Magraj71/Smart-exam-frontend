"use client";

import { useState, useEffect } from "react";
// import Router from "next/router";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  Download,
  User,
  Mail,
  Hash,
  CalendarDays,
  Home,
  GraduationCap,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  HelpCircle,
  Search,
  ChevronDown,
  BarChart3
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  rollNumber: string;
  studentId: string;
  joinedAt: string;
  avatar?: string;
}

interface Stats {
  averageScore: number;
  attendance: number;
  pendingAssignments: number;
  upcomingExams: number;
}

interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  teacher: string;
  totalMarks: number;
  passingMarks: number;
}

interface Result {
  id: string;
  examName: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  status: string;
  publishedAt: string;
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [recentResults, setRecentResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const router  = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/dashboard/student", {
          credentials: "include",
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Please log in to access dashboard");
          } else if (res.status === 403) {
            setError("Access denied. Student role required.");
          } else {
            setError("Failed to load dashboard data");
          }
          return;
        }

        const data = await res.json();
        setStudent(data.student);
        setStats(data.stats);
        setUpcomingExams(data.upcomingExams || []);
        setRecentResults(data.recentResults || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setProfileDropdown(false);
      }
      if (!target.closest('.notification-dropdown')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Prevent scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  const getGradeColor = (grade: string) => {
    if (grade.includes('A+')) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    if (grade.includes('A')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    if (grade.includes('B')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    if (grade.includes('C')) return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short' 
    }) + ' • ' + timeString;
  };

  const logoutfnc = async()=>{
    try{
      await fetch("api/auth/logout",{
        method: "POST",
      });
    }
    catch(error){
      console.log(error);
    }
    finally{
      localStorage.clear();
      router.push("/login");
    }

  }

  const navItems = [
    { label: "Dashboard", icon: Home, href: "/student/dashboard", active: true },
    { label: "Timetable", icon: Calendar, href: "/student/timetable" },
    { label: "Exams", icon: GraduationCap, href: "/student/exams" },
    { label: "Results", icon: FileText, href: "/student/results" },
    { label: "Assignments", icon: BookOpen, href: "/student/assignments" },
    { label: "Materials", icon: BookOpen, href: "/student/materials" },
    { label: "Performance", icon: BarChart3, href: "/student/performance" },
    { label: "Attendance", icon: Award, href: "/student/attendance" },
  ];

  const notifications = [
    { id: 1, title: "Maths Exam Tomorrow", message: "Unit Test - Algebra Chapter", time: "10 min ago", read: false },
    { id: 2, title: "Result Published", message: "Physics Mid-Term results are out", time: "2 hours ago", read: false },
    { id: 3, title: "Assignment Due", message: "Chemistry Lab Report submission", time: "1 day ago", read: true },
    { id: 4, title: "Attendance Alert", message: "Your attendance is below 75%", time: "2 days ago", read: true },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo & Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  EduSmart
                </span>
                <span className="ml-2 hidden rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 sm:inline dark:bg-blue-900/30 dark:text-blue-300">
                  Student
                </span>
              </div>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden flex-1 px-6 lg:block">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search exams, materials, results..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Right: Notifications & Profile */}
            <div className="flex items-center space-x-4">
              {/* Search Button (Mobile) */}
              <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <a
                          key={notification.id}
                          href="#"
                          className={`flex items-start gap-3 border-t border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                          )}
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                      <a
                        href="/student/notifications"
                        className="block text-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        View all notifications
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-3 rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {student?.name || "Student"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Class {student?.class || "XII"}
                      </p>
                    </div>
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                      {student?.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {student?.name}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {student?.email}
                      </p>
                    </div>
                    
                    <a
                      href="/student/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </a>
                    <a
                      href="/student/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </a>
                    <a
                      href="/help"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </a>
                    
                    <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-700">
                      <button 
                      onClick={logoutfnc}
                      className="flex w-full items-center gap-3 text-sm text-red-600 hover:text-red-800 dark:text-red-400">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">EduSmart</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="h-full overflow-y-auto px-4 py-6">
              {/* Mobile Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Student Info in Mobile Sidebar */}
              <div className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{student?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Roll No: {student?.rollNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Dashboard Content - Same as before */}
          <div className="space-y-6">
            {/* Header with Student Info */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                  Welcome back, {student?.name || "Student"}!
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Here's your academic overview and performance metrics
                </p>
                {student && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:gap-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Class: <span className="font-medium">{student.class}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Roll No: <span className="font-medium">{student.rollNumber}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {student.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Joined: {formatDate(student.joinedAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white hover:opacity-90">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download Report</span>
                  <span className="sm:hidden">Report</span>
                </button>
              </div>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                      {stats?.averageScore?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                  {stats?.averageScore && stats.averageScore >= 75 ? "Excellent!" : "Keep improving!"}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                      {stats?.attendance?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                    <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className={`mt-3 text-sm ${(stats?.attendance || 0) >= 75 ? 'text-green-600' : 'text-orange-600'}`}>
                  {(stats?.attendance || 0) >= 75 ? "Good attendance" : "Needs improvement"}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Assignments</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                      {stats?.pendingAssignments || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                    <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Due soon
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Exams</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                      {stats?.upcomingExams || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  In next 7 days
                </div>
              </div>
            </div>

            {/* Upcoming Exams & Recent Results - Stack on mobile */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upcoming Exams */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upcoming Exams
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingExams.length > 0 ? (
                    upcomingExams.map((exam) => {
                      const daysUntil = Math.ceil(
                        (new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                      );
                      return (
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
                                {formatDateTime(exam.date, exam.time)}
                              </p>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                                Teacher: {exam.teacher}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {daysUntil}d
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Left
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="text-center rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Total Marks</div>
                              <div className="font-semibold">{exam.totalMarks}</div>
                            </div>
                            <div className="text-center rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Passing Marks</div>
                              <div className="font-semibold">{exam.passingMarks}</div>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <a 
                              href={`/exams/${exam.id}`}
                              className="flex-1 rounded-lg bg-blue-600 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                            >
                              View Details
                            </a>
                            <button className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
                              Study Plan
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 font-medium text-gray-900 dark:text-white">No Upcoming Exams</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        You have no scheduled exams in the next 7 days
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Results */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Results
                  </h2>
                  <a 
                    href="/student/results"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    View All
                  </a>
                </div>
                <div className="space-y-4">
                  {recentResults.length > 0 ? (
                    recentResults.map((result) => (
                      <div
                        key={result.id}
                        className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getGradeColor(result.grade)} sm:h-12 sm:w-12`}>
                              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {result.subject}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {result.examName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {formatDate(result.publishedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold sm:text-2xl ${result.percentage >= 80 ? 'text-green-600' : result.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {result.grade}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {result.score}/{result.maxScore}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Score: {result.percentage}%</span>
                            <span className={`font-medium ${
                              result.status === 'pass' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div 
                              className={`h-full rounded-full ${getScoreColor(result.percentage)}`}
                              style={{ width: `${result.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 font-medium text-gray-900 dark:text-white">No Results Yet</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Your exam results will appear here once published
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions - Responsive Grid */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Quick Access
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <a
                  href="/student/timetable"
                  className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
                >
                  <Calendar className="mb-2 h-6 w-6 text-blue-600 sm:mb-3 sm:h-8 sm:w-8" />
                  <span className="text-sm font-medium sm:text-base">Timetable</span>
                  <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    View schedule
                  </span>
                </a>
                <a
                  href="/student/materials"
                  className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
                >
                  <BookOpen className="mb-2 h-6 w-6 text-green-600 sm:mb-3 sm:h-8 sm:w-8" />
                  <span className="text-sm font-medium sm:text-base">Study Materials</span>
                  <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    Access resources
                  </span>
                </a>
                <a
                  href="/student/assignments"
                  className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
                >
                  <FileText className="mb-2 h-6 w-6 text-purple-600 sm:mb-3 sm:h-8 sm:w-8" />
                  <span className="text-sm font-medium sm:text-base">Assignments</span>
                  <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    Submit work
                  </span>
                </a>
                <a
                  href="/student/performance"
                  className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
                >
                  <TrendingUp className="mb-2 h-6 w-6 text-orange-600 sm:mb-3 sm:h-8 sm:w-8" />
                  <span className="text-sm font-medium sm:text-base">Performance</span>
                  <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    Track progress
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} EduSmart. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Terms of Service
                </a>
                <a href="/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
        <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">EduSmart</span>
        </div>
        
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <div className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </div>

          {/* Student Info in Desktop Sidebar */}
          <div className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{student?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Class {student?.class} • Roll No: {student?.rollNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 space-y-2">
            <a
              href="/help"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </a>
            <a
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Settings className="h-4 w-4" />
              Settings
            </a>
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}