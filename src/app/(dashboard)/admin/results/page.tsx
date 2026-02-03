"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart3, TrendingUp, Search, Filter, Download,
  Eye, Edit2, Trash2, FileText, CheckCircle, XCircle,
  Award, Trophy, Users, Calendar, ChevronLeft,
  ChevronRight, MoreVertical, RefreshCw, Printer,
  Share2, Mail, AlertCircle, TrendingDown, Clock,
  Percent, Target, Star, TrendingUp as TrendingUpIcon,
  DownloadCloud, Upload, Settings, X
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Result {
  id: string;
  studentName: string;
  studentId: string;
  examTitle: string;
  examId: string;
  subject: string;
  class: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank: number;
  status: "passed" | "failed" | "pending";
  published: boolean;
  examDate: string;
  resultDate: string;
  teacherRemarks?: string;
  attendance?: number;
}

interface ResultStats {
  totalResults: number;
  passed: number;
  failed: number;
  pending: number;
  averagePercentage: number;
  topperPercentage: number;
  publishedResults: number;
  highestMarks: number;
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [stats, setStats] = useState<ResultStats | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);

  useEffect(() => {
    fetchResults();
    fetchStats();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/results");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/results/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filteredResults = useMemo(() => {
    return results.filter(result => {
      const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          result.studentId.includes(searchTerm) ||
                          result.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = selectedClass === "all" || result.class === selectedClass;
      const matchesSubject = selectedSubject === "all" || result.subject === selectedSubject;
      const matchesStatus = selectedStatus === "all" || result.status === selectedStatus;
      
      return matchesSearch && matchesClass && matchesSubject && matchesStatus;
    });
  }, [results, searchTerm, selectedClass, selectedSubject, selectedStatus]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const config = {
      passed: { icon: <CheckCircle className="h-3 w-3" />, text: "Passed", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
      failed: { icon: <XCircle className="h-3 w-3" />, text: "Failed", color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
      pending: { icon: <Clock className="h-3 w-3" />, text: "Pending", color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" }
    };
    
    const { icon, text, color } = config[status as keyof typeof config] || config.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${color}`}>
        {icon}
        {text}
      </span>
    );
  };

  const getGradeBadge = (grade: string) => {
    const gradeColors: { [key: string]: string } = {
      "A+": "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
      "A": "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      "B": "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      "C": "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
      "D": "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      "F": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${gradeColors[grade] || "bg-gray-100 text-gray-600"}`}>
        {grade}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const publishResults = async (resultIds: string[]) => {
    try {
      const response = await fetch("/api/admin/results/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultIds })
      });
      
      if (response.ok) {
        fetchResults();
        setSelectedResults([]);
        setShowPublishModal(false);
      }
    } catch (error) {
      console.error("Error publishing results:", error);
    }
  };

  const deleteResult = async (id: string) => {
    if (confirm("Are you sure you want to delete this result?")) {
      try {
        const response = await fetch(`/api/admin/results/${id}`, {
          method: "DELETE"
        });
        
        if (response.ok) {
          fetchResults();
        }
      } catch (error) {
        console.error("Error deleting result:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Results Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                View and manage all exam results
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <Download className="h-4 w-4" />
                Export All
              </button>
              
              {selectedResults.length > 0 && (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Publish Selected
                </button>
              )}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Results</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.totalResults}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {stats.publishedResults} published
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Percentage</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.averagePercentage}%
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <Percent className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUpIcon className="inline h-4 w-4 text-green-600" /> +2% from last term
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Passed Students</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.passed}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {((stats.passed / stats.totalResults) * 100).toFixed(1)}% pass rate
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Topper's Score</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                    {stats.topperPercentage}%
                  </p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                  <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Highest: {stats.highestMarks} marks
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
                    placeholder="Search by student name, ID, or exam..."
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
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Class
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
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
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
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
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading results...</p>
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No results found
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Exam Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Marks & Grade
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Rank
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
                  {paginatedResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                            <div className="flex h-full w-full items-center justify-center text-white font-medium">
                              {result.studentName.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {result.studentName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ID: {result.studentId}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Class: {result.class}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {result.examTitle}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.subject}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {formatDate(result.examDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Marks:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {result.obtainedMarks}/{result.totalMarks}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Percentage:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {result.percentage}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Grade:</span>
                            {getGradeBadge(result.grade)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            result.rank === 1 
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" 
                              : result.rank <= 3
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          }`}>
                            <span className="text-lg font-bold">
                              {result.rank}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {getStatusBadge(result.status)}
                          <div className="flex items-center gap-2">
                            {result.published ? (
                              <>
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Published</span>
                              </>
                            ) : (
                              <>
                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Draft</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/results/${result.id}`)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/results/${result.id}/edit`)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20">
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteResult(result.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            title="Delete"
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
          {filteredResults.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 p-4 sm:flex-row dark:border-gray-700">
              <div className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredResults.length)}
                </span>{" "}
                of <span className="font-medium">{filteredResults.length}</span> results
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

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Publish Results
              </h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Are you sure you want to publish {selectedResults.length} results?
                    </p>
                    <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">
                      Published results will be visible to students and parents.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => publishResults(selectedResults)}
                  className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                >
                  Publish Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}