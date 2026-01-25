"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { role } = useAuth();

  if (!role) redirect("/login");

  if (role === "admin") redirect("/admin");
  if (role === "teacher") redirect("/teacher");
  if (role === "student") redirect("/student");
  if (role === "parent") redirect("/parent");

  return null;
}
