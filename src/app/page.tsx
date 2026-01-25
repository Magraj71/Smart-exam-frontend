"use client";

import Link from "next/link";
import { 
  BarChart3, 
  CalendarDays, 
  ShieldCheck, 
  Brain, 
  Users, 
  FileText,
  GraduationCap,
  Sparkles,
  CheckCircle,
  MessageSquare,
  Zap,
  Cpu
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "AI Performance Prediction",
      description: "Get intelligent insights into student performance trends and improvement areas",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <CalendarDays className="h-8 w-8" />,
      title: "Smart Exam Scheduler",
      description: "Automated scheduling with clash detection and calendar integration",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Secure Verification",
      description: "QR-based document verification and secure result management",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Question Bank",
      description: "AI-powered question bank with automatic paper generation",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Multi-Role Dashboard",
      description: "Personalized dashboards for Admin, Teacher, Student & Parent",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Auto Result Generation",
      description: "Instant result generation with grade calculation and analytics",
      color: "from-violet-500 to-purple-500"
    }
  ];

  const stats = [
    { value: "99.9%", label: "Accuracy Rate", icon: <CheckCircle className="h-6 w-6" /> },
    { value: "50K+", label: "Students Served", icon: <Users className="h-6 w-6" /> },
    { value: "500+", label: "Institutions", icon: <GraduationCap className="h-6 w-6" /> },
    { value: "24/7", label: "Support", icon: <MessageSquare className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90" 
          : "bg-transparent"
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Smart<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Exam</span>
              </span>
            </div>
            
            <div className="hidden items-center space-x-8 md:flex">
              <Link href="#features" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Features
              </Link>
              <Link href="#dashboard" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Dashboard
              </Link>
              <Link href="#about" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                About
              </Link>
              <Link href="/demo" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Demo
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-medium text-white shadow-lg transition-all hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 dark:border-blue-800 dark:from-blue-900/20 dark:to-cyan-900/20">
            <Sparkles className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Revolutionizing Education Management
            </span>
          </div>
          
          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Smart <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Exam & Result</span> Management System
          </h1>
          
          <p className="mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            A comprehensive platform for educational institutions to manage exams, generate results, 
            and provide AI-powered insights for better learning outcomes.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Start Free Trial
              <Zap className="h-5 w-5" />
            </Link>
            <Link 
              href="#features" 
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-4 font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                  <div className="text-blue-600 dark:text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Powerful Features for Modern Education
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
            Everything you need to manage exams, results, and student performance in one platform
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-all group-hover:scale-125" />
              <div className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white`}>
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
              <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
                <Link 
                  href={`/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Learn more
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Role-Based Intelligent Dashboards
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
              Personalized interfaces for every user role with relevant information and actions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                role: "Admin", 
                color: "from-red-500 to-orange-500",
                features: ["System Management", "User Control", "Analytics", "Reports"]
              },
              { 
                role: "Teacher", 
                color: "from-blue-500 to-cyan-500",
                features: ["Mark Upload", "Question Bank", "Student Analytics", "Exam Creation"]
              },
              { 
                role: "Student", 
                color: "from-green-500 to-emerald-500",
                features: ["View Results", "Exam Schedule", "Study Material", "Performance"]
              },
              { 
                role: "Parent", 
                color: "from-purple-500 to-pink-500",
                features: ["Track Child", "Attendance", "Progress Reports", "Notifications"]
              }
            ].map((item, index) => (
              <div key={index} className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                <div className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${item.color} p-3 text-white`}>
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {item.role} Dashboard
                </h3>
                <ul className="space-y-3">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                      <CheckCircle className="mr-3 h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={`/${item.role.toLowerCase()}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Try {item.role} View
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 dark:from-blue-900/30 dark:to-purple-900/30">
              <Cpu className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                AI-Powered Analytics
              </span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Intelligent Performance Prediction & Analytics
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              Our AI system analyzes student performance patterns to predict future results, 
              identify weak areas, and suggest personalized study plans for optimal outcomes.
            </p>
            <ul className="space-y-4">
              {[
                "Performance trend analysis",
                "Weak topic identification",
                "Personalized study recommendations",
                "Exam success probability prediction",
                "Automated progress tracking"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
                  <div>
                    <div className="h-3 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="mt-2 h-2 w-24 rounded-full bg-gray-100 dark:bg-gray-800" />
                  </div>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Performance Score</span>
                    <span className="font-medium text-green-600">85%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-green-400 to-blue-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Improvement Areas</span>
                    <span className="font-medium text-blue-600">3 Topics</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                    <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
                    <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-pink-400 to-pink-600" />
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    AI Recommendation
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Focus on Algebra & Geometry. Estimated improvement: +15% in 2 weeks.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 text-center shadow-2xl">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your Institution?
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Join thousands of educational institutions using SmartExam System
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link 
              href="/auth/register" 
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/demo" 
              className="rounded-xl border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-all hover:bg-white/10"
            >
              Request Demo
            </Link>
          </div>
          <p className="mt-8 text-sm text-blue-200">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-8 md:flex-row md:space-y-0">
            <div className="text-center md:text-left">
              <div className="mb-4 flex items-center justify-center space-x-3 md:justify-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Smart<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Exam</span>
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Smart solutions for modern education management
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 text-center md:items-end">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400 md:items-end">
                <p>© {new Date().getFullYear()} SmartExam System. All rights reserved.</p>
                <div className="flex gap-6">
                  <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Terms of Service
                  </Link>
                  <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}