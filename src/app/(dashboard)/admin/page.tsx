"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  BarChart3, 
  Calendar, 
  Shield,
  TrendingUp,
  AlertCircle,
  Download,
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
  User,
  Mail,
  Database,
  Server,
  Cpu,
  Activity,
  Lock,
  Globe,
  Settings as SettingsIcon,
  UserPlus,
  School,
  Building,
  Package,
  ShieldCheck,
  DatabaseBackup,
  Network,
  HardDrive,
  Cloud,
  Terminal,
  Zap,
  Eye,
  Filter,
  MoreVertical
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  lastLogin: string;
  avatar?: string;
}

interface SystemStats {
  totalUsers: number;
  activeExams: number;
  pendingResults: number;
  systemHealth: number;
  storageUsed: number;
  activeSessions: number;
  apiRequests: number;
  errorRate: number;
}

interface ActivityLog {
  id: number;
  action: string;
  user: string;
  details?: string;
  time: string;
  type: "user" | "exam" | "system" | "security" | "backup";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<SystemStats|null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(8);
  const [systemOverview, setSystemOverview] = useState({
    servers: 4,
    databases: 3,
    services: 12,
    uptime: "99.9%"
  });

  const recentActivities: ActivityLog[] = [
    { id: 1, action: "New teacher registered", user: "John Smith", time: "10 min ago", type: "user" },
    { id: 2, action: "Exam created", user: "System", details: "Final Mathematics Exam", time: "1 hour ago", type: "exam" },
    { id: 3, action: "System backup completed", user: "Automated", details: "Full database backup", time: "2 hours ago", type: "backup" },
    { id: 4, action: "User permissions updated", user: "Admin", details: "3 teachers permissions modified", time: "3 hours ago", type: "security" },
    { id: 5, action: "API rate limit exceeded", user: "System", details: "From IP: 192.168.1.100", time: "4 hours ago", type: "system" },
    { id: 6, action: "New student batch imported", user: "Admin", details: "CSV import: 45 students", time: "5 hours ago", type: "user" },
  ];

  const quickActions = [
    { icon: <UserPlus className="h-5 w-5" />, label: "Add New User", href: "/admin/users/create", color: "text-blue-600 bg-blue-100" },
    { icon: <FileText className="h-5 w-5" />, label: "Create Exam", href: "/admin/exams/create", color: "text-green-600 bg-green-100" },
    { icon: <Calendar className="h-5 w-5" />, label: "Schedule Exams", href: "/admin/exams/schedule", color: "text-purple-600 bg-purple-100" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "View Analytics", href: "/admin/analytics", color: "text-orange-600 bg-orange-100" },
    { icon: <SettingsIcon className="h-5 w-5" />, label: "System Settings", href: "/admin/settings", color: "text-gray-600 bg-gray-100" },
    { icon: <DatabaseBackup className="h-5 w-5" />, label: "Backup System", href: "/admin/backup", color: "text-red-600 bg-red-100" },
  ];

  const systemServices = [
    { name: "Authentication", status: "running", uptime: "99.9%", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Database", status: "running", uptime: "99.8%", icon: <Database className="h-4 w-4" /> },
    { name: "File Storage", status: "running", uptime: "99.5%", icon: <HardDrive className="h-4 w-4" /> },
    { name: "API Gateway", status: "running", uptime: "99.7%", icon: <Network className="h-4 w-4" /> },
    { name: "Email Service", status: "degraded", uptime: "95.2%", icon: <Mail className="h-4 w-4" /> },
    { name: "SMS Gateway", status: "running", uptime: "99.6%", icon: <Globe className="h-4 w-4" /> },
  ];

  useEffect(() => {
    // Simulate fetching admin data
    const fetchdashboard = async()=>{
      try{
        const res = await fetch("/api/dashboard/admin/stats",{
          credentials: "include",
          headers:{
            'Accept':'application/json',
          }
        })
        if (!res.ok) {
          if (res.status === 401) {
           console.log("problem occurs");
          }
          return;
        }

        const data = await res.json();
        setAdmin(data.admin);
        setStats(data.stats)
      }
      catch(error){
        console.error("admin fetch ",error);
      }
    }
    
    fetchdashboard();
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

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'exam': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'system': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'security': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'backup': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const logout = async()=>{
     try{
      await fetch("/api/auth/logout",{
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />;
      case 'exam': return <FileText className="h-4 w-4" />;
      case 'system': return <Cpu className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'backup': return <DatabaseBackup className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getServiceStatusColor = (status: string) => {
    return status === 'running' 
      ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
      : 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const navItems = [
    { label: "Dashboard", icon: Home, href: "/admin/dashboard", active: true },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Exams", icon: FileText, href: "/admin/exams" },
    { label: "Results", icon: BarChart3, href: "/admin/results" },
    { label: "Analytics", icon: TrendingUp, href: "/admin/analytics" },
    { label: "System", icon: SettingsIcon, href: "/admin/system" },
    { label: "Reports", icon: FileText, href: "/admin/reports" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
    { label: "Logs", icon: Terminal, href: "/admin/logs" },
  ];

  const notifications = [
    { id: 1, title: "High Server Load", message: "Server 3 at 85% CPU", time: "10 min ago", read: false },
    { id: 2, title: "Backup Failed", message: "Scheduled backup failed", time: "2 hours ago", read: false },
    { id: 3, title: "Security Alert", message: "Multiple failed login attempts", time: "1 day ago", read: false },
    { id: 4, title: "New User Registration", message: "15 new teachers registered", time: "2 days ago", read: true },
    { id: 5, title: "System Update", message: "Version 2.5.1 available", time: "3 days ago", read: true },
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
              {/* System Status */}
              <div className="hidden items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-800 sm:flex">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  System {stats?.systemHealth ??0}%
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
                        <h3 className="font-semibold text-gray-900 dark:text-white">System Alerts</h3>
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
                            !notification.read ? 'bg-red-50 dark:bg-red-900/20' : ''
                          }`}
                        >
                          <div className={`rounded-full p-2 ${
                            notification.title.includes('Alert') || notification.title.includes('Failed') 
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
                        {admin?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {admin?.role || "Administrator"}
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
                        {admin?.name}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {admin?.email}
                      </p>
                    </div>
                    
                    <a
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4" />
                      Admin Profile
                    </a>
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      System Settings
                    </a>
                    <a
                      href="/admin/help"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Admin Help
                    </a>
                    
                    <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-700">
                      <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 text-sm text-red-600 hover:text-red-800 dark:text-red-400">
                        <LogOut className="h-4 w-4" />
                        Logout Admin
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

              {/* Admin Info */}
              <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-orange-600"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{admin?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      System Administrator
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded bg-gray-100 p-2 text-center dark:bg-gray-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Last Login</p>
                    <p className="text-sm font-medium">{admin?.lastLogin ? formatDate(admin.lastLogin).split(',')[0] : 'Today'}</p>
                  </div>
                  <div className="rounded bg-gray-100 p-2 text-center dark:bg-gray-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Permissions</p>
                    <p className="text-sm font-medium">Full</p>
                  </div>
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
      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                System Administration
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Monitor and manage your institution's complete ecosystem
              </p>
              {admin && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Role: <span className="font-medium">{admin.role}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {admin.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Login: {admin.lastLogin ? formatDate(admin.lastLogin) : 'Now'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Uptime: {systemOverview.uptime}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Audit Log</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2 font-medium text-white hover:opacity-90">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Reports</span>
                <span className="sm:hidden">Export</span>
              </button>
              <button className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <Plus className="h-4 w-4" />
                Quick Add
              </button>
            </div>
          </div>

          {/* System Overview */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Servers</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {systemOverview.servers}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-green-600">
                <Zap className="mr-1 h-4 w-4" />
                <span>All operational</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats?.activeSessions??0}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-600">342 live</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Storage Used</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats?.storageUsed??0}%
                  </p>
                </div>
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                  <HardDrive className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                1.2TB / 1.5TB
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Error Rate</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats?.errorRate??0}%
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-green-600">
                Within threshold
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats?.totalUsers.toLocaleString()??0}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+12% from last month</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Exams</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats?.activeExams??0}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-600">8 running</span>, 4 scheduled
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Results</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats?.pendingResults??0}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Need evaluation
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats?.systemHealth??0}%
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-green-600">
                All systems operational
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quick Actions
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    More
                  </button>
                </div>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <a
                      key={index}
                      href={action.href}
                      className="flex items-center gap-3 rounded-lg p-3 text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <div className={`rounded-lg p-2 ${action.color} dark:bg-opacity-30`}>
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
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    System Activity Log
                  </h2>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                      Filter
                    </button>
                  </div>
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
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              By: {activity.user}
                            </span>
                            {activity.details && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {activity.details}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
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

          {/* System Services & Charts */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* System Services */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                System Services Status
              </h2>
              <div className="space-y-3">
                {systemServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                        {service.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-medium ${getServiceStatusColor(service.status)}`}>
                      {service.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API & System Metrics */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                API & System Metrics
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">API Requests (24h)</span>
                    <span className="font-medium">{stats?.apiRequests.toLocaleString()??0}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-full w-4/5 rounded-full bg-blue-500"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Database Load</span>
                    <span className="font-medium">62%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-full w-3/5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Memory Usage</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-full w-3/4 rounded-full bg-orange-500"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Network I/O</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-full w-2/5 rounded-full bg-purple-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} EduSmart - Admin Portal v2.5.1. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="/admin/docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Documentation
                </a>
                <a href="/admin/support" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Support
                </a>
                <a href="/admin/changelog" className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                  Changelog
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
          <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Admin
          </span>
        </div>
        
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          {/* Admin Info */}
          <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-orange-600"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{admin?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  System Administrator
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded bg-gray-100 p-2 text-center dark:bg-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">Permissions</p>
                <p className="text-sm font-medium">Full Access</p>
              </div>
              <div className="rounded bg-gray-100 p-2 text-center dark:bg-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">System</p>
                <p className="text-sm font-medium">{stats?.systemHealth??0}%</p>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">System Status</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    // stats?.systemHealth>= 90 ? 'bg-green-500' :
                    // stats.systemHealth >= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stats?.systemHealth??0}% Healthy</p>
                </div>
              </div>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">Servers</p>
                <p className="text-sm font-medium">{systemOverview.servers}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">DBs</p>
                <p className="text-sm font-medium">{systemOverview.databases}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">Services</p>
                <p className="text-sm font-medium">{systemOverview.services}</p>
              </div>
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
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </div>

          {/* System Links */}
          <div className="mt-6 space-y-2">
            <a
              href="/admin/monitoring"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Activity className="h-4 w-4" />
              Real-time Monitoring
            </a>
            <a
              href="/admin/backup"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <DatabaseBackup className="h-4 w-4" />
              Backup & Restore
            </a>
            <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
              <LogOut className="h-4 w-4" />
              Logout Admin
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}