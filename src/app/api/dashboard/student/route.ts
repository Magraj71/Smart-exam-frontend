import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import Exam from "@/models/Exam";
import Result from "@/models/Result";
import Attendance from "@/models/Attendance";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const token =
      req.headers.get("authorization")?.split(" ")[1] ||
      cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = verifyToken(token);

    if (!decoded || decoded.role !== "student") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Fetch student details
    const student = await User.findById(decoded.id).select("-password");
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    // ✅ Upcoming exams (use classId & subjectId)
    const upcomingExams = await Exam.find({
      classId: student.classId, // ✅ make sure your User model has classId
      date: { $gte: today, $lte: sevenDaysLater },
      status: "scheduled",
    })
      .populate("subjectId", "name") // optional
      .populate("chiefInvigilator", "name email") // optional
      .sort({ date: 1 })
      .limit(5)
      .lean();

    // ✅ Recent results
    const recentResults = await Result.find({ studentId: decoded.id })
      .populate("examId", "title date startTime endTime totalMarks passingMarks")
      .sort({ publishedAt: -1 })
      .limit(5)
      .lean();

    // Average score
    const allResults = await Result.find({ studentId: decoded.id }).lean();
    const averageScore =
      allResults.length > 0
        ? allResults.reduce((sum: number, result: any) => sum + (result.percentage || 0), 0) /
          allResults.length
        : 0;

    // Attendance percentage
    const attendanceRecords = await Attendance.find({ studentId: decoded.id }).lean();
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter((r: any) => r.status === "present").length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    const pendingAssignments = 2; // dummy

    const responseData = {
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        classId: student.classId,
        rollNumber: student.rollNumber,
        studentId: student.studentId,
        joinedAt: student.createdAt,
      },
      stats: {
        averageScore: parseFloat(averageScore.toFixed(1)),
        attendance: parseFloat(attendancePercentage.toFixed(1)),
        pendingAssignments,
        upcomingExams: upcomingExams.length,
      },
      upcomingExams: upcomingExams.map((exam: any) => ({
        id: exam._id,
        name: exam.title, // ✅ FIXED
        subject: exam.subjectId?.name || "N/A", // ✅ FIXED
        date: new Date(exam.date).toISOString().split("T")[0],
        time: `${exam.startTime} - ${exam.endTime}`,
        teacher: exam.chiefInvigilator?.name || "N/A", // ✅ FIXED
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
      })),
      recentResults: recentResults.map((result: any) => ({
        id: result._id,
        examName: result.examId?.title || "N/A", // ✅ FIXED
        subject: result.subject || "N/A",
        score: result.marksObtained,
        maxScore: result.totalMarks,
        percentage: result.percentage,
        grade: result.grade,
        status: result.status,
        publishedAt: result.publishedAt,
      })),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ message: "Dashboard fetch failed" }, { status: 500 });
  }
}
