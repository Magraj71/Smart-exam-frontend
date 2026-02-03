import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import Exam from "@/models/Exam";
import Result from "@/models/Result";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();

    // Get token from Authorization header OR cookies
    const token =
      req.headers.get("authorization")?.split(" ")[1] ||
      cookieStore.get("token")?.value;

    // If token not found
    if (!token) {
      return NextResponse.json(
        { message: "Admin is not logged in" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded: any = verifyToken(token);

    // Check admin role
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Find admin user
    const admin = await User.findById(decoded.id).select("-password");

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const totalUsers = await User.countDocuments();
    const activeExams = await Exam.countDocuments({ status: "ongoing" });
    const pendingResults = await Result.countDocuments({ publishedAt: null });

    // dummy data
    const systemHealth = 95;
    const storageUsed = 60;
    const activeSessions = 12;
    const apiRequests = 250;
    const errorRate = 2;
    // Response data
    const responseData = {
      admin:{
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions || [],
        lastLogin: admin.lastLogin,
        avatar: admin.avatar,
      },
      stats:{
        totalUsers: totalUsers,
        activeExams: activeExams,
        pendingResults: pendingResults,
        systemHealth: systemHealth,
        storageUsed:storageUsed,
        activeSessions: activeSessions,
        apiRequests: apiRequests,
        errorRate: errorRate,
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
