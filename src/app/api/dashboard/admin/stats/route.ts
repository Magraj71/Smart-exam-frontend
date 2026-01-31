import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

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

    // Response data
    const responseData = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions || [],
      lastLogin: admin.lastLogin,
      avatar: admin.avatar,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
