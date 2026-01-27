"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
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
  BarChart3,
  Calendar,
  Award,
  Download,
  User,
  Mail,
  Hash,
  CalendarDays,
  LayoutDashboard,
  BookCheck,
  ClipboardList,
  Presentation
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  subjects: string[];
  joinedAt: string;
  avatar?: string;
}

interface Stats {
  totalStudents: number;
  pendingEvaluations: number;
  upcomingExams: number;
  averageScore: number;
  totalClasses: number;
  completedEvaluations: number;
}

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  duration: string;
  class: string;
  totalStudents: number;
}

interface Evaluation {
  id: number;
  student: string;
  subject: string;
  submitted: string;
  type: string;
  priority: "high" | "medium" | "low";
}

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 85,
    pendingEvaluations: 12,
    upcomingExams: 3,
    averageScore: 78.5,
    totalClasses: 4,
    completedEvaluations: 48
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(5);

  const upcomingExams: Exam[] = [
    { id: 1, subject: "Mathematics", date: "Dec 15, 2023", time: "10:00 AM", duration: "3 hours", class: "12-A", totalStudents: 25 },
    { id: 2, subject: "Physics", date: "Dec 18, 2023", time: "2:00 PM", duration: "2 hours", class: "11-B", totalStudents: 20 },
    { id: 3, subject: "Computer Science", date: "Dec 20, 2023", time: "9:00 AM", duration: "3 hours", class: "12-C", totalStudents: 18 },
  ];

  const toEvaluate: Evaluation[] = [
    { id: 1, student: "John Doe", subject: "Mathematics", submitted: "2 days ago", type: "Assignment", priority: "high" },
    { id: 2, student: "Jane Smith", subject: "Physics", submitted: "1 day ago", type: "Lab Report", priority: "medium" },
    { id: 3, student: "Bob Johnson", subject: "Chemistry", submitted: "Today", type: "Project", priority: "high" },
    { id: 4, student: "Alice Williams", subject: "Mathematics", submitted: "3 days ago", type: "Test Paper", priority: "low" },
  ];

  const router = useRouter();
 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/dashboard/teacher", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      const data: Teacher = await res.json();
      setTeacher(data);
      // setStats(data.stats);
    } catch (error) {
      console.error("Teacher fetch error:", error);
    }
  };

  fetchUser();
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/teacher/dashboard", active: true },
    { label: "Classes", icon: Users, href: "/teacher/classes" },
    { label: "Exams", icon: GraduationCap, href: "/teacher/exams" },
    { label: "Question Bank", icon: BookOpen, href: "/teacher/question-bank" },
    { label: "Evaluations", icon: BookCheck, href: "/teacher/evaluations" },
    { label: "Attendance", icon: CheckCircle, href: "/teacher/attendance" },
    { label: "Study Materials", icon: BookOpen, href: "/teacher/materials" },
    { label: "Reports", icon: BarChart3, href: "/teacher/reports" },
  ];

  const notifications = [
    { id: 1, title: "New Assignment Submitted", message: "Mathematics assignment by John Doe", time: "10 min ago", read: false },
    { id: 2, title: "Exam Schedule Updated", message: "Physics exam rescheduled to Dec 20", time: "2 hours ago", read: false },
    { id: 3, title: "Meeting Reminder", message: "Department meeting at 3 PM today", time: "1 day ago", read: false },
    { id: 4, title: "Student Query", message: "Alice has a question about the project", time: "2 days ago", read: true },
    { id: 5, title: "System Update", message: "New grading features available", time: "3 days ago", read: true },
  ];

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
                <span className="ml-2 hidden rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 sm:inline dark:bg-green-900/30 dark:text-green-300">
                  Teacher
                </span>
              </div>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden flex-1 px-6 lg:block">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search students, exams, materials..."
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
                        <button
                          onClick={() => setUnreadNotifications(0)}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <a
                          key={notification.id}
                          href="#"
                          className={`flex items-start gap-3 border-t border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
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
                        href="/teacher/notifications"
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
                        {teacher?.name || "Teacher"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {teacher?.department || "Department"}
                      </p>
                    </div>
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-blue-600">
                      {teacher?.avatar ? (
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
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
                        {teacher?.name}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {teacher?.email}
                      </p>
                    </div>

                    <a
                      href="/teacher/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </a>
                    <a
                      href="/teacher/settings"
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
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${item.active
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Teacher Info in Mobile Sidebar */}
              <div className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{teacher?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Emp ID: {teacher?.employeeId}
                    </p>
                  </div>
                </div>
                {teacher?.subjects && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {teacher.subjects.slice(0, 2).map((subject, index) => (
                      <span key={index} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {subject}
                      </span>
                    ))}
                    {teacher.subjects.length > 2 && (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        +{teacher.subjects.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Welcome, {teacher?.name || "Teacher"}!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your classes, exams, and student evaluations
              </p>
              {teacher && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:gap-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Dept: <span className="font-medium">{teacher.department}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Emp ID: <span className="font-medium">{teacher.employeeId}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {teacher.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Joined: {formatDate(teacher.joinedAt)}
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
              <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2 font-medium text-white hover:opacity-90">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Exam</span>
                <span className="sm:hidden">New Exam</span>
              </button>
              <button className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <BookOpen className="h-4 w-4" />
                Add Material
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.totalStudents}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Across {stats.totalClasses} classes
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Evaluations</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.pendingEvaluations}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Need your attention
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Exams</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.upcomingExams}
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

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.averageScore}%
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                +5.2% from last term
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed Evaluations</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.completedEvaluations}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                This semester
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.totalClasses}
                  </p>
                </div>
                <div className="rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900/30">
                  <Presentation className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Active sessions
              </div>
            </div>
          </div>

          {/* Upcoming Exams & To Evaluate */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {exam.class}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {exam.totalStudents} students
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
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
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  To Evaluate
                </h2>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                  {stats.pendingEvaluations} pending
                </span>
              </div>
              <div className="space-y-4">
                {toEvaluate.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.subject}
                        </h3>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.student} • {item.type}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Submitted: {item.submitted}
                      </p>
                    </div>
                    <button className="ml-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                      Evaluate
                    </button>
                  </div>
                ))}
                <div className="text-center">
                  <a
                    href="/teacher/evaluations"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    View all pending evaluations
                    <ChevronDown className="ml-1 h-4 w-4 rotate-270" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="/teacher/question-bank"
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
              >
                <BookOpen className="mb-2 h-6 w-6 text-blue-600 sm:mb-3 sm:h-8 sm:w-8" />
                <span className="text-sm font-medium sm:text-base">Question Bank</span>
                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  250+ questions
                </span>
              </a>
              <a
                href="/teacher/students"
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
              >
                <Users className="mb-2 h-6 w-6 text-green-600 sm:mb-3 sm:h-8 sm:w-8" />
                <span className="text-sm font-medium sm:text-base">Students</span>
                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  Manage students
                </span>
              </a>
              <a
                href="/teacher/attendance"
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
              >
                <CheckCircle className="mb-2 h-6 w-6 text-purple-600 sm:mb-3 sm:h-8 sm:w-8" />
                <span className="text-sm font-medium sm:text-base">Attendance</span>
                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  Mark today
                </span>
              </a>
              <a
                href="/teacher/reports"
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
              >
                <FileText className="mb-2 h-6 w-6 text-orange-600 sm:mb-3 sm:h-8 sm:w-8" />
                <span className="text-sm font-medium sm:text-base">Reports</span>
                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  Generate reports
                </span>
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                See all
              </button>
            </div>
            <div className="space-y-4">
              {[
                { action: "Created Math assignment", time: "2 hours ago", icon: FileText, color: "text-blue-600" },
                { action: "Graded 15 Physics papers", time: "Yesterday", icon: CheckCircle, color: "text-green-600" },
                { action: "Updated exam schedule", time: "2 days ago", icon: Calendar, color: "text-purple-600" },
                { action: "Uploaded study materials", time: "3 days ago", icon: BookOpen, color: "text-orange-600" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`rounded-full bg-gray-100 p-2 dark:bg-gray-700 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} EduSmart - Teacher Portal. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="/teacher/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Teacher Help
                </a>
                <a href="/teacher/resources" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Resources
                </a>
                <a href="/teacher/feedback" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Feedback
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
          <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Teacher
          </span>
        </div>

        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          {/* Teacher Info */}
          <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-blue-600"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{teacher?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {teacher?.department}
                </p>
              </div>
            </div>
            {teacher?.subjects && (
              <div className="mt-3 flex flex-wrap gap-2">
                {teacher.subjects.map((subject, index) => (
                  <span key={index} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {subject}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${item.active
                    ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Pending</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.pendingEvaluations}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-900/70 dark:text-blue-400" />
              </div>
              <p className="mt-2 text-xs text-blue-800 dark:text-blue-400">Evaluations pending</p>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 space-y-2">
            <a
              href="/teacher/resources"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <HelpCircle className="h-4 w-4" />
              Teacher Resources
            </a>
            <a
              href="/teacher/settings"
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