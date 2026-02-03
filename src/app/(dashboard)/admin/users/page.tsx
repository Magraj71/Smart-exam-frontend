"use client";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Edit2, 
  Trash2, 
  UserPlus,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Building,
  Users as UsersIcon,
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Home,
  FileText,
  BarChart3,
  TrendingUp,
  Activity,
  DatabaseBackup,
  Terminal,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student" | "parent";
  phone?: string;
  address?: string;
  profilePicture?: string;

  studentId?: string;
  rollNumber?: string;
  class?: string;
  section?: string;

  teacherId?: string;
  subjects?: string[];
  qualification?: string;
  experience?: number;
  department?: string;

  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Navbar states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [admin, setAdmin] = useState({
    name: "Admin User",
    email: "admin@edusmart.com",
    role: "Super Admin"
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (role !== "all") query.set("role", role);
      if (status !== "all") query.set("status", status);
      query.set("page", currentPage.toString());
      query.set("limit", itemsPerPage.toString());

      const res = await fetch(`/api/dashboard/admin/users?${query.toString()}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, status]);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/dashboard/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to update user status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/dashboard/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchUsers();
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const total = useMemo(() => users.length, [users]);

  const getRoleStats = () => {
    const stats = { admin: 0, teacher: 0, student: 0, parent: 0 };
    users.forEach(user => {
      if (stats[user.role] !== undefined) {
        stats[user.role]++;
      }
    });
    return stats;
  };

  const roleStats = getRoleStats();

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
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
                <span className="ml-2 hidden rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 sm:inline dark:bg-red-900/30 dark:text-red-300">
                  Admin
                </span>
              </div>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden flex-1 px-6 lg:block">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search users, exams, logs..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Right: Notifications & Profile */}
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              {/* System Status */}
              <div className="hidden items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-800 sm:flex">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  System {users.filter(u => u.isActive).length}/{users.length} Active
                </span>
              </div>

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
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    3
                  </span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">System Alerts</h3>
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[
                        { id: 1, title: "New User", message: "John registered", time: "10 min ago", read: false },
                        { id: 2, title: "Update", message: "Version available", time: "2 hours ago", read: false },
                        { id: 3, title: "Security", message: "Login attempts", time: "1 day ago", read: false },
                      ].map((notification) => (
                        <a
                          key={notification.id}
                          href="#"
                          className={`flex items-start gap-3 border-t border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${
                            !notification.read ? 'bg-red-50 dark:bg-red-900/20' : ''
                          }`}
                        >
                          <div className={`rounded-full p-2 ${
                            notification.title.includes('Security') 
                              ? 'bg-red-100 dark:bg-red-900/30' 
                              : 'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
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
                            <div className="h-2 w-2 rounded-full bg-red-600"></div>
                          )}
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                      <a
                        href="/admin/alerts"
                        className="block text-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        View all alerts
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
                        {admin.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {admin.role}
                      </p>
                    </div>
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-red-500 to-orange-600">
                      <div className="flex h-full w-full items-center justify-center text-white">
                        <Shield className="h-4 w-4" />
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {admin.name}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {admin.email}
                      </p>
                    </div>
                    
                    <a
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </a>
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </a>
                    <a
                      href="/admin/help"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help
                    </a>
                    
                    <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-700">
                      <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 text-sm text-red-600 hover:text-red-800 dark:text-red-400">
                        <LogOut className="h-4 w-4" />
                        Logout
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
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="h-full overflow-y-auto px-4 py-6">
              {/* Admin Info */}
              <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-orange-600"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{admin.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      System Administrator
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded bg-gray-100 p-2 text-center dark:bg-gray-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-sm font-medium">{total}</p>
                  </div>
                  <div className="rounded bg-gray-100 p-2 text-center dark:bg-gray-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
                    <p className="text-sm font-medium">{users.filter(u => u.isActive).length}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {[
                  { label: "Dashboard", icon: Home, href: "/admin", active: false },
                  { label: "Users", icon: UsersIcon, href: "/admin/users", active: true },
                  { label: "Exams", icon: FileText, href: "/admin/exams", active: false },
                  { label: "Results", icon: BarChart3, href: "/admin/results", active: false },
                  { label: "Analytics", icon: TrendingUp, href: "/admin/analytics", active: false },
                  { label: "Monitoring", icon: Activity, href: "/admin/monitoring", active: false },
                  { label: "Backup", icon: DatabaseBackup, href: "/admin/backup", active: false },
                  { label: "Logs", icon: Terminal, href: "/admin/logs", active: false },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section with Back Button */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage all system users with complete control
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <button 
                onClick={() => router.push('/admin/users/create')}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add New User</span>
                <span className="sm:hidden">Add User</span>
              </button>
              
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{roleStats.admin}</p>
                </div>
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Teachers</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{roleStats.teacher}</p>
                </div>
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{roleStats.student}</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                  <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the existing content remains the same */}
        {/* Filters Section */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter Users
            </h2>
            <Filter className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
            
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                    User
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                    Contact
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                    Role
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                    Created
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  // Loading Skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="mx-auto max-w-md">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                          No users found
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr 
                      key={user._id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {user.phone || "Not provided"}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : user.role === 'teacher'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : user.role === 'student'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}>
                          {user.role === 'admin' && <Shield className="h-3 w-3" />}
                          {user.role === 'teacher' && <BookOpen className="h-3 w-3" />}
                          {user.role === 'student' && <GraduationCap className="h-3 w-3" />}
                          {user.role}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {user.isActive ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Inactive
                              </>
                            )}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                            user.isVerified
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                            disabled={actionLoading}
                            className={`rounded-lg p-2 ${
                              user.isActive
                                ? 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20'
                                : 'text-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-900/20'
                            }`}
                            title={user.isActive ? "Deactivate User" : "Activate User"}
                          >
                            {user.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => {
                              setUserToDelete(user._id);
                              setShowDeleteConfirm(true);
                            }}
                            disabled={actionLoading}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, total)}</span> of{" "}
              <span className="font-medium">{total}</span> users
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(total / itemsPerPage) }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === Math.ceil(total / itemsPerPage) ||
                    Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 w-9 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? 'bg-red-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * itemsPerPage >= total}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <div className="mb-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Delete User
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => userToDelete && deleteUser(userToDelete)}
                  disabled={actionLoading}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserDetailsModal({
  user,
  onClose,
}: {
  user: UserType;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              User Details
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Complete information about {user.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Profile Header */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : user.role === 'teacher'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : user.role === 'student'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    user.isVerified
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <User className="h-5 w-5" />
                Basic Information
              </h4>
              <div className="space-y-4">
                <Detail label="Full Name" value={user.name} />
                <Detail label="Email Address" value={user.email} />
                <Detail label="Phone Number" value={user.phone || "Not provided"} />
                <Detail label="Address" value={user.address || "Not provided"} />
              </div>
            </div>

            {/* Account Information */}
            <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Shield className="h-5 w-5" />
                Account Information
              </h4>
              <div className="space-y-4">
                <Detail label="User ID" value={user._id} copyable />
                <Detail label="Account Created" value={new Date(user.createdAt).toLocaleString()} />
                <Detail label="Last Updated" value={new Date(user.updatedAt).toLocaleString()} />
                <Detail label="Email Verified" value={user.emailVerified ? "Yes" : "No"} />
              </div>
            </div>

            {/* Role Specific Information */}
            {user.role === 'student' && (
              <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <GraduationCap className="h-5 w-5" />
                  Student Information
                </h4>
                <div className="space-y-4">
                  <Detail label="Student ID" value={user.studentId || "Not assigned"} />
                  <Detail label="Roll Number" value={user.rollNumber || "Not assigned"} />
                  <Detail label="Class" value={user.class || "Not assigned"} />
                  <Detail label="Section" value={user.section || "Not assigned"} />
                </div>
              </div>
            )}

            {user.role === 'teacher' && (
              <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <BookOpen className="h-5 w-5" />
                  Teacher Information
                </h4>
                <div className="space-y-4">
                  <Detail label="Teacher ID" value={user.teacherId || "Not assigned"} />
                  <Detail label="Department" value={user.department || "Not assigned"} />
                  <Detail label="Qualification" value={user.qualification || "Not provided"} />
                  <Detail label="Experience" value={`${user.experience || 0} years`} />
                  <Detail 
                    label="Subjects" 
                    value={user.subjects?.join(", ") || "Not assigned"} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
              Edit User
            </button>
            <button className="rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ 
  label, 
  value, 
  copyable = false 
}: { 
  label: string; 
  value: any;
  copyable?: boolean;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value.toString());
  };

  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-1 text-gray-900 dark:text-white">{value}</p>
      </div>
      {copyable && (
        <button
          onClick={handleCopy}
          className="ml-2 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          title="Copy to clipboard"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      )}
    </div>
  );
}