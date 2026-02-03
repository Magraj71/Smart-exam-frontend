"use client";

import { useState } from "react";
import { 
  UserPlus, 
  ArrowLeft, 
  Save, 
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  BookOpen,
  GraduationCap,
  Users,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Building,
  Briefcase,
  Book,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UserRole = "student" | "teacher" | "admin" | "parent";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  
  // Student specific
  studentId?: string;
  rollNumber?: string;
  class?: string;
  section?: string;
  
  // Teacher specific
  teacherId?: string;
  subjects?: string[];
  qualification?: string;
  experience?: string;
  department?: string;
  
  // Parent specific
  children?: string[];
  occupation?: string;
  
  // Admin specific
  permissions?: string[];
  accessLevel?: "full" | "limited";
  
  // Common
  sendWelcomeEmail: boolean;
  generateRandomPassword: boolean;
}

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
//   const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "student",
    password: "",
    confirmPassword: "",
    
    // Student
    studentId: "",
    rollNumber: "",
    class: "",
    section: "",
    
    // Teacher
    teacherId: "",
    subjects: [],
    qualification: "",
    experience: "",
    department: "",
    
    // Parent
    children: [],
    occupation: "",
    
    // Admin
    permissions: ["read", "write"],
    accessLevel: "limited",
    
    // Common
    sendWelcomeEmail: true,
    generateRandomPassword: false,
  });

  const availableSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology",
    "English", "History", "Geography", "Computer Science",
    "Art", "Music", "Physical Education", "Economics"
  ];

  const availableClasses = [
    "Nursery", "KG", "1", "2", "3", "4", "5", "6", 
    "7", "8", "9", "10", "11", "12"
  ];

  const availableSections = ["A", "B", "C", "D", "E"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === "subjects") {
      const select = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        subjects: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.generateRandomPassword) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Role-specific validations
    if (formData.role === "student") {
      if (!formData.studentId?.trim()) newErrors.studentId = "Student ID is required";
      if (!formData.class) newErrors.class = "Class is required";
    }

    if (formData.role === "teacher") {
      if (!formData.teacherId?.trim()) newErrors.teacherId = "Teacher ID is required";
      if (!formData.qualification?.trim()) newErrors.qualification = "Qualification is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password, confirmPassword: password }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        role: formData.role,
        password: formData.generateRandomPassword ? undefined : formData.password,
        
        // Role-specific data
        ...(formData.role === "student" && {
          studentId: formData.studentId,
          rollNumber: formData.rollNumber,
          class: formData.class,
          section: formData.section,
        }),
        
        ...(formData.role === "teacher" && {
          teacherId: formData.teacherId,
          subjects: formData.subjects,
          qualification: formData.qualification,
          experience: formData.experience ? parseInt(formData.experience) : undefined,
          department: formData.department,
        }),
        
        ...(formData.role === "parent" && {
          children: formData.children,
          occupation: formData.occupation,
        }),
        
        ...(formData.role === "admin" && {
          permissions: formData.permissions,
          accessLevel: formData.accessLevel,
        }),

        // Options
        sendWelcomeEmail: formData.sendWelcomeEmail,
        generateRandomPassword: formData.generateRandomPassword,
      };

      const response = await fetch("/api/dashboard/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      setCreatedUserId(data.userId);
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/admin/users");
      }, 3000);

    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin": return <Shield className="h-5 w-5" />;
      case "teacher": return <BookOpen className="h-5 w-5" />;
      case "student": return <GraduationCap className="h-5 w-5" />;
      case "parent": return <Users className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "teacher": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "student": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "parent": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (success && createdUserId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navbar would go here */}
        
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                User Created Successfully!
              </h1>
              
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                A new user account has been created successfully.
              </p>
              
              <div className="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  User ID: <span className="font-mono font-medium">{createdUserId}</span>
                </p>
                {formData.sendWelcomeEmail && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    A welcome email has been sent to {formData.email}
                  </p>
                )}
              </div>
              
              <div className="mt-8">
                <Link
                  href="/admin/users"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white hover:opacity-90"
                >
                  View All Users
                </Link>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Redirecting to users list in 3 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar would go here */}
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-100"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
                <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Create New User
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Add a new user to the system with appropriate permissions
                </p>
              </div>
              
              <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2">
                <UserPlus className="h-5 w-5 text-white" />
                <span className="font-medium text-white">New User</span>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-300">{errors.submit}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Selection */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Select User Role
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(["student", "teacher", "admin", "parent"] as UserRole[]).map((role) => (
                  <label
                    key={role}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:scale-[1.02] ${
                      formData.role === role
                        ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    
                    <div className="flex flex-col items-center gap-3">
                      <div className={`rounded-full p-3 ${getRoleColor(role)}`}>
                        {getRoleIcon(role)}
                      </div>
                      
                      <div className="text-center">
                        <p className="font-medium capitalize text-gray-900 dark:text-white">
                          {role}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {role === "student" && "Enroll a new student"}
                          {role === "teacher" && "Add teaching staff"}
                          {role === "admin" && "Add system administrator"}
                          {role === "parent" && "Add parent/guardian"}
                        </p>
                      </div>
                      
                      {formData.role === role && (
                        <div className="absolute right-3 top-3">
                          <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:bg-gray-700 dark:text-white`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:bg-gray-700 dark:text-white`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="123 Main St, City, Country"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Account Security
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="generateRandomPassword"
                    name="generateRandomPassword"
                    checked={formData.generateRandomPassword}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="generateRandomPassword" className="text-sm font-medium text-gray-900 dark:text-white">
                    Generate random password
                  </label>
                  {formData.generateRandomPassword && (
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="ml-auto text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      Regenerate
                    </button>
                  )}
                </div>
                
                {!formData.generateRandomPassword && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full rounded-lg border ${
                            errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                          } bg-gray-50 px-4 py-3 pr-10 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:bg-gray-700 dark:text-white`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Must be at least 8 characters with letters, numbers, and symbols
                      </p>
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full rounded-lg border ${
                            errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                          } bg-gray-50 px-4 py-3 pr-10 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:bg-gray-700 dark:text-white`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendWelcomeEmail"
                    name="sendWelcomeEmail"
                    checked={formData.sendWelcomeEmail}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="sendWelcomeEmail" className="text-sm font-medium text-gray-900 dark:text-white">
                    Send welcome email with login instructions
                  </label>
                </div>
              </div>
            </div>

            {/* Role Specific Information */}
            {formData.role === "student" && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Student Information
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Student ID *
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.studentId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      } bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:bg-gray-700 dark:text-white`}
                      placeholder="STU20240001"
                    />
                    {errors.studentId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="25"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Class *
                    </label>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.class ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      } bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:bg-gray-700 dark:text-white`}
                    >
                      <option value="">Select Class</option>
                      {availableClasses.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                    {errors.class && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.class}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Section
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Section</option>
                      {availableSections.map(sec => (
                        <option key={sec} value={sec}>Section {sec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.role === "teacher" && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Teacher Information
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Teacher ID *
                    </label>
                    <input
                      type="text"
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.teacherId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      } bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:bg-gray-700 dark:text-white`}
                      placeholder="TCH20240001"
                    />
                    {errors.teacherId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.teacherId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Science Department"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Qualification *
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.qualification ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      } bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:bg-gray-700 dark:text-white`}
                      placeholder="M.Sc in Physics"
                    />
                    {errors.qualification && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.qualification}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      max="50"
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="5"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Assigned Subjects
                    </label>
                    <select
                      name="subjects"
                      multiple
                      value={formData.subjects}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      size={4}
                    >
                      {availableSubjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Hold Ctrl (Cmd on Mac) to select multiple subjects
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.role === "admin" && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Administrator Permissions
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Access Level
                    </label>
                    <select
                      name="accessLevel"
                      value={formData.accessLevel}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="limited">Limited Access</option>
                      <option value="full">Full Administrator</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {formData.accessLevel === "limited" 
                        ? "Limited access to specific modules only"
                        : "Full access to all system features"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Initial Permissions
                    </label>
                    <div className="space-y-2 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                      {["User Management", "Exam Management", "Result Processing", "System Settings"].map(permission => (
                        <div key={permission} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`perm-${permission}`}
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <label htmlFor={`perm-${permission}`} className="text-sm text-gray-900 dark:text-white">
                            {permission}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.role === "parent" && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Parent Information
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Business"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Children (Student IDs)
                    </label>
                    <textarea
                      name="children"
                      value={formData.children?.join(", ")}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        children: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                      }))}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="STU20240001, STU20240002"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Enter comma-separated student IDs
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="sticky bottom-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      // Reset form logic
                      if (confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          address: "",
                          role: "student",
                          password: "",
                          confirmPassword: "",
                          studentId: "",
                          rollNumber: "",
                          class: "",
                          section: "",
                          teacherId: "",
                          subjects: [],
                          qualification: "",
                          experience: "",
                          department: "",
                          children: [],
                          occupation: "",
                          permissions: ["read", "write"],
                          accessLevel: "limited",
                          sendWelcomeEmail: true,
                          generateRandomPassword: false,
                        });
                        setErrors({});
                      }
                    }}
                    className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    Reset Form
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-8 py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Creating User...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By creating this user, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}