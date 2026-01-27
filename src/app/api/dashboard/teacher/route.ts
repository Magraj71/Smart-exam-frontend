// app/api/dashboard/teacher/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import Exam from "@/models/Exam";
import Assignment from "@/models/Assignment";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();   // ✅ await here

  const token =
    req.headers.get("authorization")?.split(" ")[1] ||
    cookieStore.get("token")?.value;  


    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = verifyToken(token);

    if (decoded.role !== "teacher") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // 🔹 Teacher info
    const teacher = await User.findById(decoded.id).select("-password");
    if (!teacher) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }

    // 🔹 Stats
    const totalStudents = 85; // Can be dynamic later
    const totalClasses = teacher.subjects?.length || 0;

    const pendingEvaluations = await Assignment.countDocuments({
      teacherId: decoded.id,
      evaluated: false,
    });

    const completedEvaluations = await Assignment.countDocuments({
      teacherId: decoded.id,
      evaluated: true,
    });

    const upcomingExams = await Exam.countDocuments({
      teacherId: decoded.id,
      date: { $gte: new Date() },
    });

    const response = {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      employeeId: teacher.employeeId,
      subjects: teacher.subjects,
      joinedAt: teacher.createdAt,

      stats: {
        totalStudents,
        pendingEvaluations,
        completedEvaluations,
        upcomingExams,
        averageScore: 78.5,
        totalClasses,
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Teacher dashboard error" },
      { status: 500 }
    );
  }
}
