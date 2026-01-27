"use client";

import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  AlertCircle,
  MessageSquare,
  Bell,
  Home,
  GraduationCap,
  Menu,
  X,
  LogOut,
  Settings,
  HelpCircle,
  Search,
  ChevronDown,
  User,
  Mail,
  Phone,
  School,
  Heart,
  Download,
  Shield,
  CreditCard,
  BookOpen,
  BarChart3,
  Clock,
  Hash,
  CalendarDays
} from "lucide-react";

interface Child {
  id: number;
  name: string;
  grade: string;
  class: string;
  rollNumber: string;
  school: string;
  attendance: number;
  averageScore: number;
  avatar?: string;
}

interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  childrenCount: number;
  joinedAt: string;
}

interface Activity {
  id: number;
  child: string;
  action: string;
  time: string;
  score?: number;
  type: "exam" | "assignment" | "attendance" | "meeting" | "general";
}

interface Event {
  id: number;
  event: string;
  child: string;
  date: string;
  time: string;
  type: "exam" | "meeting" | "event" | "deadline";
  priority: "high" | "medium" | "low";
}

export default function ParentDashboard() {
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Child[]>([
    { 
      id: 1, 
      name: "John Doe", 
      grade: "10th", 
      class: "10-A",
      rollNumber: "10A25",
      school: "Delhi Public School",
      attendance: 95, 
      averageScore: 85.5 
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      grade: "8th", 
      class: "8-B",
      rollNumber: "8B15",
      school: "Delhi Public School",
      attendance: 88, 
      averageScore: 78.2 
    },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(7);

  const recentActivities: Activity[] = [
    { id: 1, child: "John Doe", action: "Mathematics exam completed", time: "Yesterday", score: 85, type: "exam" },
    { id: 2, child: "Jane Smith", action: "Science project submitted", time: "2 days ago", type: "assignment" },
    { id: 3, child: "John Doe", action: "Low attendance warning (Below 90%)", time: "3 days ago", type: "attendance" },
    { id: 4, child: "Both", action: "Parent-teacher meeting scheduled", time: "1 week ago", type: "meeting" },
    { id: 5, child: "Jane Smith", action: "Sports day participation", time: "4 days ago", type: "general" },
  ];

  const upcomingEvents: Event[] = [
    { id: 1, event: "Mathematics Annual Exam", child: "John Doe", date: "Dec 15", time: "10:00 AM", type: "exam", priority: "high" },
    { id: 2, event: "Parent-Teacher Meeting", child: "Both", date: "Dec 18", time: "2:00 PM", type: "meeting", priority: "high" },
    { id: 3, event: "Science Fair Exhibition", child: "Jane Smith", date: "Dec 20", time: "9:00 AM", type: "event", priority: "medium" },
    { id: 4, event: "Project Submission Deadline", child: "John Doe", date: "Dec 22", time: "11:59 PM", type: "deadline", priority: "medium" },
  ];

  useEffect(() => {
    // Simulate fetching parent data
    setParent({
      id: "P001",
      name: "Robert Johnson",
      email: "robert.johnson@email.com",
      phone: "+91 98765 43210",
      childrenCount: 2,
      joinedAt: "2022-01-15"
    });
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam': return <FileText className="h-4 w-4" />;
      case 'assignment': return <BookOpen className="h-4 w-4" />;
      case 'attendance': return <AlertCircle className="h-4 w-4" />;
      case 'meeting': return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'exam': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'assignment': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'attendance': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'meeting': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
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
    { label: "Dashboard", icon: Home, href: "/parent/dashboard", active: true },
    { label: "Children", icon: Users, href: "/parent/children" },
    { label: "Results", icon: Award, href: "/parent/results" },
    { label: "Attendance", icon: Calendar, href: "/parent/attendance" },
    { label: "Messages", icon: MessageSquare, href: "/parent/messages" },
    { label: "Events", icon: Calendar, href: "/parent/events" },
    { label: "Fee Status", icon: CreditCard, href: "/parent/fees" },
    { label: "Reports", icon: BarChart3, href: "/parent/reports" },
  ];

  const notifications = [
    { id: 1, title: "John's Maths Exam Tomorrow", message: "Don't forget to prepare", time: "10 min ago", read: false },
    { id: 2, title: "Fee Payment Reminder", message: "Last date: Dec 20, 2023", time: "2 hours ago", read: false },
    { id: 3, title: "Jane's Science Project", message: "Submitted successfully", time: "1 day ago", read: false },
    { id: 4, title: "PTM Scheduled", message: "Meeting with class teacher", time: "2 days ago", read: true },
    { id: 5, title: "Attendance Alert", message: "John's attendance is 85%", time: "3 days ago", read: true },
  ];

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
                <span className="ml-2 hidden rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 sm:inline dark:bg-purple-900/30 dark:text-purple-300">
                  Parent
                </span>
              </div>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden flex-1 px-6 lg:block">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search children, events, reports..."
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
                        href="/parent/notifications"
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
                        {parent?.name || "Parent"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {parent?.childrenCount || 0} children
                      </p>
                    </div>
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
                      <div className="flex h-full w-full items-center justify-center text-white">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {parent?.name}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {parent?.email}
                      </p>
                    </div>
                    
                    <a
                      href="/parent/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </a>
                    <a
                      href="/parent/settings"
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
                      <button className="flex w-full items-center gap-3 text-sm text-red-600 hover:text-red-800 dark:text-red-400">
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
                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Parent Info in Mobile Sidebar */}
              <div className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{parent?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Parent of {children.length} children
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-3 w-3" />
                  {parent?.phone}
                </div>
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
                Welcome, {parent?.name || "Parent"}!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track your children's academic progress and activities
              </p>
              {parent && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Children: <span className="font-medium">{parent.childrenCount}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {parent.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {parent.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Joined: {formatDate(parent.joinedAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Family Calendar</span>
                <span className="sm:hidden">Calendar</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-medium text-white hover:opacity-90">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Contact Teacher</span>
                <span className="sm:hidden">Message</span>
              </button>
            </div>
          </div>

          {/* Children Overview */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {children.map((child) => (
              <div key={child.id} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {child.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-600 dark:text-gray-400">
                          Grade {child.grade}
                        </p>
                        <span className="text-gray-400">•</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {child.class} | Roll: {child.rollNumber}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {child.school}
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
                        child.attendance >= 75 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        <Award className={`h-5 w-5 ${
                          child.attendance >= 90 ? 'text-green-600 dark:text-green-400' :
                          child.attendance >= 75 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Current</span>
                        <span className={`font-medium ${
                          child.attendance >= 90 ? 'text-green-600' :
                          child.attendance >= 75 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {child.attendance >= 90 ? 'Excellent' :
                           child.attendance >= 75 ? 'Good' :
                           'Needs Improvement'}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                        <div 
                          className={`h-full rounded-full ${
                            child.attendance >= 90 ? 'bg-green-500' :
                            child.attendance >= 75 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${child.attendance}%` }}
                        ></div>
                      </div>
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
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Performance</span>
                        <span className={`font-medium ${
                          child.averageScore >= 80 ? 'text-green-600' :
                          child.averageScore >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {child.averageScore >= 80 ? 'A Grade' :
                           child.averageScore >= 60 ? 'B Grade' :
                           'C Grade'}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                        <div 
                          className={`h-full rounded-full ${
                            child.averageScore >= 80 ? 'bg-green-500' :
                            child.averageScore >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${child.averageScore}%` }}
                        ></div>
                      </div>
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
                  <button className="hidden sm:flex flex-1 rounded-lg border border-purple-300 bg-purple-50 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                    Contact Teacher
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activities & Upcoming Events */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Recent Activities */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
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
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
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
                    </div>
                    {activity.action.includes("warning") && (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
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
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </span>
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
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="/parent/results"
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
              >
                <FileText className="mb-2 h-6 w-6 text-blue-600 sm:mb-3 sm:h-8 sm:w-8" />
                <span className="text-sm font-medium sm:text-base">View Results</span>
                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  Exam scores
                </span>
              </a>
              <a
                href="/parent/attendance"
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
              >
                <Calendar className="mb-2 h-6 w-6 text-green-600 sm:mb-3 sm:h-8 sm:w-8" />
                <span className="text-sm font-medium sm:text-base">Attendance</span>
                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  Track presence
                </span>
              </a>
              <a
                href="/parent/messages"
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
              >
                <MessageSquare className="mb-2 h-6 w-6 text-purple-600 sm:mb-3 sm:h-8 sm:w-8" />
                <span className="text-sm font-medium sm:text-base">Messages</span>
                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  Contact teachers
                </span>
              </a>
              <a
                href="/parent/fees"
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 sm:p-6"
              >
                <CreditCard className="mb-2 h-6 w-6 text-orange-600 sm:mb-3 sm:h-8 sm:w-8" />
                <span className="text-sm font-medium sm:text-base">Fee Status</span>
                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  View dues
                </span>
              </a>
            </div>
          </div>

          {/* Family Summary */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Family Average Score</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {((children.reduce((acc, child) => acc + child.averageScore, 0)) / children.length).toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Across all children
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Children</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {children.length}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Enrolled students
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unread Messages</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {unreadNotifications}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                From teachers
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Events</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {upcomingEvents.length}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                This month
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} EduSmart - Parent Portal. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="/parent/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Privacy Policy
                </a>
                <a href="/parent/support" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Parent Support
                </a>
                <a href="/parent/feedback" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
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
          <span className="ml-2 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            Parent
          </span>
        </div>
        
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          {/* Parent Info */}
          <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{parent?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Parent of {children.length} children
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-3 w-3" />
                {parent?.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-3 w-3" />
                {parent?.phone}
              </div>
            </div>
          </div>

          {/* Children List */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Your Children</h3>
            <div className="space-y-2">
              {children.map((child) => (
                <a
                  key={child.id}
                  href={`/parent/child/${child.id}`}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{child.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{child.grade}</p>
                  </div>
                  <div className="ml-auto">
                    <div className={`h-2 w-2 rounded-full ${
                      child.attendance >= 90 ? 'bg-green-500' :
                      child.attendance >= 75 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </div>

          {/* Additional Links */}
          <div className="mt-6 space-y-2">
            <a
              href="/parent/resources"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <HelpCircle className="h-4 w-4" />
              Parent Resources
            </a>
            <a
              href="/parent/settings"
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