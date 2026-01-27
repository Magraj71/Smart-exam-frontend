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

    // Authentication
   const cookieStore = await cookies();   // ✅ await here

  const token =
    req.headers.get("authorization")?.split(" ")[1] ||
    cookieStore.get("token")?.value;  

    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    
    if (decoded.role !== "student") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Fetch student details
    const student = await User.findById(decoded.id).select("-password");
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Calculate stats
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    // Get upcoming exams
    const upcomingExams = await Exam.find({
      class: student.class,
      date: { $gte: today, $lte: sevenDaysLater },
      status: 'scheduled'
    })
    .populate('teacherId', 'name email')
    .sort('date')
    .limit(5);

    // Get recent results
    const recentResults = await Result.find({ studentId: decoded.id })
      .populate('examId', 'name subject date')
      .sort('-publishedAt')
      .limit(5);

    // Calculate average score
    const allResults = await Result.find({ studentId: decoded.id });
    const averageScore = allResults.length > 0 
      ? allResults.reduce((sum, result) => sum + result.percentage, 0) / allResults.length
      : 0;

    // Get attendance percentage
    const attendanceRecords = await Attendance.find({ studentId: decoded.id });
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === 'present').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Count pending assignments
    // Note: You'll need to create Assignment model
    const pendingAssignments = 2; // Replace with actual count

    // Format response
    const responseData = {
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        class: student.class,
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
      upcomingExams: upcomingExams.map(exam => ({
        id: exam._id,
        name: exam.name,
        subject: exam.subject,
        date: exam.date.toISOString().split('T')[0],
        time: `${exam.startTime} - ${exam.endTime}`,
        teacher: exam.teacherId?.name || 'N/A',
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
      })),
      recentResults: recentResults.map(result => ({
        id: result._id,
        examName: result.examId?.name || 'N/A',
        subject: result.subject,
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
    return NextResponse.json(
      { message: "Dashboard fetch failed" },
      { status: 500 }
    );
  }
}