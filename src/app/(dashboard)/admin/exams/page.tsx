"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, Filter, Calendar, Clock, Users,
  FileText, Edit2, Trash2, Eye, Download, MoreVertical,
  ChevronLeft, ChevronRight, CheckCircle, XCircle,
  BarChart3, Copy, Lock, Unlock, CalendarDays, Tag,
  BookOpen, Building, GraduationCap, Hash, Clock3,
  Calendar as CalendarIcon, Import, RefreshCw,
  Layers, Target, TrendingUp, BookMarked, Shield,
  Zap, X, Upload, Check, AlertTriangle, Settings,
  DownloadCloud, Printer, Share2, Link as LinkIcon, QrCode,
  Star, Award, Trophy, Users as UsersIcon, Database,
  HardDrive, Activity, Globe
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Exam {
  id: string;
  title: string;
  code: string;
  subject: string;
  class: string;
  totalMarks: number;
  passingMarks: number;
  duration: number;
  date: string;
  time: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  questionType: "mcq" | "written" | "mixed";
  totalQuestions: number;
  registeredStudents: number;
  isOnline: boolean;
  hasResults: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  instructions?: string;
  room?: string;
  invigilator?: string;
  isActive: boolean;
  isPublished: boolean;
  difficulty: "easy" | "medium" | "hard";
  averageScore?: number;
  passPercentage?: number;
}

interface ExamStats {
  totalExams: number;
  activeExams: number;
  completedExams: number;
  scheduledExams: number;
  totalStudentsRegistered: number;
  averageAttendance: number;
  totalQuestions: number;
  upcomingExams: number;
}

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    class: "all",
    subject: "all",
    type: "all"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    fetchExams();
    fetchStats();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/exams");
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/exams/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exam.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === "all" || exam.status === filters.status;
      const matchesClass = filters.class === "all" || exam.class === filters.class;
      const matchesSubject = filters.subject === "all" || exam.subject === filters.subject;
      const matchesType = filters.type === "all" || 
                         (filters.type === "online" && exam.isOnline) ||
                         (filters.type === "offline" && !exam.isOnline);
      
      return matchesSearch && matchesStatus && matchesClass && matchesSubject && matchesType;
    });
  }, [exams, searchTerm, filters]);

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedExams.length === paginatedExams.length) {
      setSelectedExams([]);
    } else {
      setSelectedExams(paginatedExams.map(exam => exam.id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedExams.length === 0) return;
    
    try {
      const response = await fetch("/api/admin/exams/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedExams, action: bulkAction })
      });
      
      if (response.ok) {
        fetchExams();
        setSelectedExams([]);
        setBulkAction("");
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const deleteExam = async (id: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      try {
        const response = await fetch(`/api/admin/exams/${id}`, {
          method: "DELETE"
        });
        
        if (response.ok) {
          fetchExams();
        }
      } catch (error) {
        console.error("Error deleting exam:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      scheduled: { icon: <Calendar className="h-3 w-3" />, text: "Scheduled", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
      ongoing: { icon: <Clock className="h-3 w-3" />, text: "Ongoing", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
      completed: { icon: <CheckCircle className="h-3 w-3" />, text: "Completed", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
      cancelled: { icon: <XCircle className="h-3 w-3" />, text: "Cancelled", color: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400" }
    };
    
    const { icon, text, color } = config[status as keyof typeof config] || config.scheduled;
    
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${color}`}>
        {icon}
        {text}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      medium: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
      hard: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[difficulty as keyof typeof colors]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Exam Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create, schedule, and manage all exams
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 font-medium text-white hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                New Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Exams</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.totalExams}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-600">+3 this week</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Exams</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.activeExams}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {stats.scheduledExams} scheduled
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
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                  <CalendarDays className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Next 7 days
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.totalStudentsRegistered}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Avg: {stats.averageAttendance}% attendance
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>

              <div className="flex items-center gap-3">
                {selectedExams.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedExams.length} selected
                    </span>
                    <select
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Bulk Actions</option>
                      <option value="publish">Publish</option>
                      <option value="unpublish">Unpublish</option>
                      <option value="delete">Delete</option>
                    </select>
                    <button
                      onClick={handleBulkAction}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Class
                    </label>
                    <select
                      value={filters.class}
                      onChange={(e) => setFilters({...filters, class: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="all">All Classes</option>
                      <option value="8th">8th Grade</option>
                      <option value="9th">9th Grade</option>
                      <option value="10th">10th Grade</option>
                      <option value="11th">11th Grade</option>
                      <option value="12th">12th Grade</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <select
                      value={filters.subject}
                      onChange={(e) => setFilters({...filters, subject: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="all">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="all">All Types</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exams Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading exams...</p>
                </div>
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No exams found
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedExams.length === paginatedExams.length && paginatedExams.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Exam Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Schedule
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Statistics
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedExams.includes(exam.id)}
                          onChange={() => setSelectedExams(prev => 
                            prev.includes(exam.id) 
                              ? prev.filter(id => id !== exam.id)
                              : [...prev, exam.id]
                          )}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className={`rounded-lg p-2 ${
                            exam.isOnline 
                              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}>
                            {exam.isOnline ? (
                              <Globe className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {exam.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {exam.code} • {exam.subject} • {exam.class}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              {getDifficultyBadge(exam.difficulty)}
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {exam.totalMarks} marks
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {formatDate(exam.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {exam.time} • {exam.duration} mins
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Students:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {exam.registeredStudents}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Questions:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {exam.totalQuestions}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(exam.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/exams/${exam.id}`)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/exams/${exam.id}/edit`)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteExam(exam.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filteredExams.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 p-4 sm:flex-row dark:border-gray-700">
              <div className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredExams.length)}
                </span>{" "}
                of <span className="font-medium">{filteredExams.length}</span> exams
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Exam
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Exam Title *
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Mathematics Final Exam"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject *
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class *
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <option value="">Select Class</option>
                    <option value="8th">8th Grade</option>
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => router.push("/admin/exams/create")}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}