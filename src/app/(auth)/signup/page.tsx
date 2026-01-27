"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Eye, EyeOff, User, Mail, Lock, GraduationCap, Loader2, 
  Phone, Home, Calendar, Hash, UserPlus, BookOpen, Shield,
  ChevronDown, School, Users, Baby
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    // Common fields
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "student",
    
    // Student specific
    rollNumber: "",
    class: "",
    section: "A",
    dateOfBirth: "",
    gender: "male",
    bloodGroup: "",
    parentEmail: "",
    
    // Teacher specific
    teacherId: "",
    qualification: "",
    experience: "0",
    department: "",
    subjects: [] as string[],
    joiningDate: "",
    
    // Parent specific
    parentName: "",
    childrenEmails: [] as string[],
    childrenCount: "1",
  });

  const [activeStep, setActiveStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableClasses] = useState(["10", "11", "12", "B.Tech", "B.Sc", "B.Com"]);
  const [availableSubjects] = useState(["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "History", "Geography"]);
  const [childEmails, setChildEmails] = useState(["", ""]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'subjects') {
        const updatedSubjects = checked 
          ? [...form.subjects, value]
          : form.subjects.filter(subject => subject !== value);
        setForm({ ...form, subjects: updatedSubjects });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleChildEmailChange = (index: number, value: string) => {
    const updatedEmails = [...childEmails];
    updatedEmails[index] = value;
    setChildEmails(updatedEmails);
    setForm({ ...form, childrenEmails: updatedEmails.filter(email => email) });
  };

  const addChildEmailField = () => {
    setChildEmails([...childEmails, ""]);
    setForm({ ...form, childrenCount: (parseInt(form.childrenCount) + 1).toString() });
  };

  const removeChildEmailField = (index: number) => {
    if (childEmails.length > 1) {
      const updatedEmails = childEmails.filter((_, i) => i !== index);
      setChildEmails(updatedEmails);
      setForm({ 
        ...form, 
        childrenEmails: updatedEmails.filter(email => email),
        childrenCount: (parseInt(form.childrenCount) - 1).toString()
      });
    }
  };

  const validateStep = (step: number) => {
    switch(step) {
      case 1:
        if (!form.name.trim()) return "Name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email format";
        if (!form.password) return "Password is required";
        if (form.password.length < 6) return "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        break;
      
      case 2:
        if (!form.role) return "Please select a role";
        
        if (form.role === "student") {
          if (!form.rollNumber) return "Roll number is required";
          if (!form.class) return "Class is required";
          if (!form.dateOfBirth) return "Date of birth is required";
        }
        
        if (form.role === "teacher") {
          if (!form.qualification) return "Qualification is required";
          if (!form.department) return "Department is required";
          if (form.subjects.length === 0) return "Please select at least one subject";
        }
        
        if (form.role === "parent") {
          if (!form.parentName) return "Parent name is required";
          if (form.childrenEmails.length === 0) return "Please add at least one child's email";
        }
        break;
      
      default:
        break;
    }
    return "";
  };

  const nextStep = () => {
    const error = validateStep(activeStep);
    if (error) {
      setError(error);
      return;
    }
    setError("");
    setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    setError("");
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const finalError = validateStep(activeStep);
    if (finalError) {
      setError(finalError);
      setLoading(false);
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      phone: form.phone || undefined,
      address: form.address || undefined,
      ...(form.role === "student" && {
        rollNumber: form.rollNumber,
        class: form.class,
        section: form.section,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        parentEmail: form.parentEmail || undefined,
      }),
      ...(form.role === "teacher" && {
        qualification: form.qualification,
        experience: parseInt(form.experience),
        department: form.department,
        subjects: form.subjects,
        joiningDate: form.joiningDate || undefined,
      }),
      ...(form.role === "parent" && {
        parentName: form.parentName,
        childrenEmails: form.childrenEmails,
      }),
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Show success message and redirect
      alert("Account created successfully! Please check your email for verification.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step <= activeStep 
              ? "bg-green-600 text-white" 
              : "bg-gray-200 dark:bg-gray-700 text-gray-500"
          }`}>
            {step < activeStep ? "✓" : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step < activeStep ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
            }`} />
          )}
        </div>
      ))}
      <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
        Step {activeStep} of 3
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch(activeStep) {
      case 1:
        return (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Basic Information
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Enter your personal details
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none pr-12"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin (Invite Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="address"
                    placeholder="Enter your address"
                    rows={2}
                    value={form.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 2:
        if (form.role === "student") {
          return (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Student Information
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Enter your academic details
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Roll Number *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        name="rollNumber"
                        type="text"
                        placeholder="2024001"
                        required
                        value={form.rollNumber}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Class *
                    </label>
                    <select
                      name="class"
                      value={form.class}
                      onChange={handleChange}
                      required
                      className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select Class</option>
                      {availableClasses.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Section
                    </label>
                    <select
                      name="section"
                      value={form.section}
                      onChange={handleChange}
                      className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      {['A', 'B', 'C', 'D'].map(sec => (
                        <option key={sec} value={sec}>Section {sec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        name="dateOfBirth"
                        type="date"
                        required
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={handleChange}
                      className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Parent's Email
                    </label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        name="parentEmail"
                        type="email"
                        placeholder="parent@example.com"
                        value={form.parentEmail}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }

        if (form.role === "teacher") {
          return (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-3">
                  <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Teacher Information
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Enter your professional details
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Qualification *
                    </label>
                    <input
                      name="qualification"
                      type="text"
                      placeholder="M.Tech, M.Sc, Ph.D, etc."
                      required
                      value={form.qualification}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department *
                    </label>
                    <input
                      name="department"
                      type="text"
                      placeholder="Computer Science, Mathematics, etc."
                      required
                      value={form.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Experience (Years)
                    </label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      {[...Array(31)].map((_, i) => (
                        <option key={i} value={i}>{i} {i === 1 ? 'year' : 'years'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Joining Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        name="joiningDate"
                        type="date"
                        value={form.joiningDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subjects Taught *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableSubjects.map((subject) => (
                      <div key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`subject-${subject}`}
                          name="subjects"
                          value={subject}
                          checked={form.subjects.includes(subject)}
                          onChange={handleChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`subject-${subject}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {subject}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          );
        }

        if (form.role === "parent") {
          return (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Parent Information
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Enter details about your children
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Parent Name *
                  </label>
                  <input
                    name="parentName"
                    type="text"
                    placeholder="Enter your name as parent"
                    required
                    value={form.parentName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Children's Email Addresses *
                    </label>
                    <button
                      type="button"
                      onClick={addChildEmailField}
                      className="text-sm text-green-600 hover:text-green-800 dark:text-green-400"
                    >
                      + Add Another Child
                    </button>
                  </div>
                  
                  {childEmails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 mb-3">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder={`Child ${index + 1} email`}
                          value={email}
                          onChange={(e) => handleChildEmailChange(index, e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        />
                      </div>
                      {childEmails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChildEmailField(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Baby className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Note about Children Registration
                      </h4>
                      <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                        Your children must already be registered as students in the system. 
                        Enter their registered email addresses to link them to your parent account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }

        if (form.role === "admin") {
          return (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-3">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Admin Registration
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Administrator accounts require special access
                </p>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 p-6 text-center">
                <School className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  Admin Access Required
                </h3>
                <p className="text-yellow-700 dark:text-yellow-400 mb-4">
                  Admin accounts are created by invitation only. Please contact your institution's 
                  system administrator for access or switch to another role to continue.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm({...form, role: "student"});
                    setError("");
                  }}
                  className="px-6 py-2 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                >
                  Switch to Student Role
                </button>
              </div>
            </>
          );
        }

        return null;

      case 3:
        return (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Review Information
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Please review your information before submitting
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Personal Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <div className="font-medium">{form.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <div className="font-medium">{form.email}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Role:</span>
                    <div className="font-medium capitalize">{form.role}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                    <div className="font-medium">{form.phone || "Not provided"}</div>
                  </div>
                </div>
              </div>

              {form.role === "student" && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Academic Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Roll Number:</span>
                      <div className="font-medium">{form.rollNumber}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Class:</span>
                      <div className="font-medium">{form.class}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Section:</span>
                      <div className="font-medium">{form.section}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Date of Birth:</span>
                      <div className="font-medium">{form.dateOfBirth}</div>
                    </div>
                  </div>
                </div>
              )}

              {form.role === "teacher" && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Professional Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Qualification:</span>
                      <div className="font-medium">{form.qualification}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Department:</span>
                      <div className="font-medium">{form.department}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                      <div className="font-medium">{form.experience} years</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Subjects:</span>
                      <div className="font-medium">{form.subjects.join(", ")}</div>
                    </div>
                  </div>
                </div>
              )}

              {form.role === "parent" && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Children Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Parent Name:</span>
                      <div className="font-medium">{form.parentName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Children Emails:</span>
                      <div className="font-medium space-y-1">
                        {form.childrenEmails.map((email, index) => (
                          <div key={index}>• {email}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <button type="button" className="text-green-600 hover:text-green-800 dark:text-green-400 font-medium">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-green-600 hover:text-green-800 dark:text-green-400 font-medium">
                    Privacy Policy
                  </button>
                  . I confirm that all information provided is accurate.
                </label>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-green-600 to-cyan-600 mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SmartExam Registration
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join our intelligent education management platform
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-300 text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              )}
              
              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-70 transition-opacity flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold text-green-600 hover:text-green-800 dark:text-green-400"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} SmartExam System. Intelligent Education Management Platform.
          </p>
        </div>
      </div>
    </div>
  );
}