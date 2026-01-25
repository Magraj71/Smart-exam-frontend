"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, 
  X, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  Home,
  GraduationCap,
  FileText,
  Calendar,
  BarChart3,
  BookOpen,
  MessageSquare,
  Search,
  ChevronDown,
  Mail,
  Shield
} from "lucide-react";

export default function Navbar() {
  const { role, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setNotificationsOpen(false);
      setProfileOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!role) return null;

  // Role-based navigation items
  const getNavItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    ];

    const roleSpecificItems = {
      admin: [
        { href: "/admin/users", label: "Users", icon: <User className="h-5 w-5" /> },
        { href: "/admin/exams", label: "Exams", icon: <FileText className="h-5 w-5" /> },
        { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
        { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
      ],
      teacher: [
        { href: "/teacher/students", label: "Students", icon: <User className="h-5 w-5" /> },
        { href: "/teacher/exams", label: "Exams", icon: <FileText className="h-5 w-5" /> },
        { href: "/teacher/question-bank", label: "Question Bank", icon: <BookOpen className="h-5 w-5" /> },
        { href: "/teacher/schedule", label: "Schedule", icon: <Calendar className="h-5 w-5" /> },
      ],
      student: [
        { href: "/student/results", label: "Results", icon: <FileText className="h-5 w-5" /> },
        { href: "/student/exams", label: "Exams", icon: <Calendar className="h-5 w-5" /> },
        { href: "/student/materials", label: "Study Materials", icon: <BookOpen className="h-5 w-5" /> },
        { href: "/student/performance", label: "Performance", icon: <BarChart3 className="h-5 w-5" /> },
      ],
      parent: [
        { href: "/parent/children", label: "Children", icon: <User className="h-5 w-5" /> },
        { href: "/parent/results", label: "Results", icon: <FileText className="h-5 w-5" /> },
        { href: "/parent/attendance", label: "Attendance", icon: <Calendar className="h-5 w-5" /> },
        { href: "/parent/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
      ],
    };

    return [...baseItems, ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || [])];
  };

  // Role-based user info
  const getUserInfo = () => {
    if (user) return user;
    
    const defaultInfo = {
      name: "User",
      email: "user@example.com",
      avatar: `https://ui-avatars.com/api/?name=${role}&background=random`,
    };

    const roleInfo = {
      admin: { name: "Administrator", email: "admin@smartexam.com" },
      teacher: { name: "Teacher Name", email: "teacher@school.edu" },
      student: { name: "Student Name", email: "student@school.edu" },
      parent: { name: "Parent Name", email: "parent@email.com" },
    };

    return { ...defaultInfo, ...roleInfo[role as keyof typeof roleInfo] };
  };

  // Sample notifications
  const notifications = [
    { id: 1, title: "New exam scheduled", message: "Maths exam on 15th Dec", time: "10 min ago", read: false },
    { id: 2, title: "Result published", message: "Physics result is now available", time: "1 hour ago", read: false },
    { id: 3, title: "Assignment due", message: "Submit History assignment", time: "2 hours ago", read: true },
    { id: 4, title: "System update", message: "Platform maintenance tonight", time: "1 day ago", read: true },
  ];

  const navItems = getNavItems();
  const userInfo = getUserInfo();

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg" 
          : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:hover:bg-gray-800 lg:hidden"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>

              <div className="ml-4 flex items-center lg:ml-0">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Smart<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Exam</span>
                  </span>
                  <span className="ml-2 hidden rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-2 py-1 text-xs font-medium text-blue-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 md:inline-block">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden flex-1 max-w-md mx-6 lg:block">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Search exams, students, results..."
                />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Button (Mobile) */}
              <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationsOpen(!notificationsOpen);
                    setProfileOpen(false);
                  }}
                  className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {notifications.filter(n => !n.read).length} new
                        </span>
                      </div>
                      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`rounded-lg p-3 transition-colors ${
                              notification.read
                                ? "bg-gray-50 dark:bg-gray-700/50"
                                : "bg-blue-50 dark:bg-blue-900/20"
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                <Bell className="h-4 w-4 text-white" />
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/notifications"
                        className="mt-4 block rounded-lg bg-gray-100 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-3 rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="relative">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={userInfo.avatar}
                      alt={userInfo.name}
                    />
                    <div className="absolute -bottom-1 -right-1">
                      {role === "admin" && (
                        <Shield className="h-4 w-4 rounded-full bg-green-500 p-0.5 text-white" />
                      )}
                      {role === "teacher" && (
                        <User className="h-4 w-4 rounded-full bg-blue-500 p-0.5 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userInfo.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </p>
                  </div>
                  <ChevronDown className="hidden h-5 w-5 text-gray-400 md:block" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
                    <div className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={userInfo.avatar}
                          alt={userInfo.name}
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userInfo.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {userInfo.email}
                          </p>
                          <p className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                            {role.charAt(0).toUpperCase() + role.slice(1)} Account
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <Link
                          href="/profile"
                          className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <User className="mr-3 h-5 w-5 text-gray-400" />
                          Your Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <Settings className="mr-3 h-5 w-5 text-gray-400" />
                          Settings
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <Mail className="mr-3 h-5 w-5 text-gray-400" />
                          Messages
                          <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            3
                          </span>
                        </Link>
                      </div>

                      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <button
                          onClick={logout}
                          className="flex w-full items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar (Mobile) */}
          <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-800 lg:hidden">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="Search exams, students, results..."
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 transform lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}>
        <div className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
        <div className="relative flex h-full w-80 max-w-full flex-col bg-white shadow-xl dark:bg-gray-900">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Smart<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Exam</span>
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* User Info */}
            <div className="mb-6 flex items-center space-x-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-900/20 dark:to-purple-900/20">
              <img
                className="h-12 w-12 rounded-full"
                src={userInfo.avatar}
                alt={userInfo.name}
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {userInfo.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userInfo.email}
                </p>
                <span className="mt-1 inline-block rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 space-y-1">
              <Link
                href="/profile"
                className="flex items-center rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <User className="mr-3 h-5 w-5" />
                Your Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
              <Link
                href="/messages"
                className="flex items-center rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Mail className="mr-3 h-5 w-5" />
                Messages
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  3
                </span>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-200 p-6 dark:border-gray-800">
            <button
              onClick={logout}
              className="flex w-full items-center justify-center rounded-lg bg-red-50 px-4 py-3 text-base font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}