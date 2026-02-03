import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const token =
      req.headers.get("authorization")?.split(" ")[1] ||
      cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    const decoded: any = verifyToken(token);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";
    const status = searchParams.get("status") || "all";

    const query: any = {};

    // search by name/email/phone
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // role filter
    if (role !== "all") query.role = role;

    // status filter
    if (status !== "all") query.isActive = status === "active";

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Users fetched successfully", total: users.length, users },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const cookieStore =await cookies();

    const token =
      req.headers.get("authorization")?.split(" ")[1] ||
      cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    const decoded: any = verifyToken(token);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();

    const {
      name,
      email,
      phone,
      address,
      role,
      password,
      generateRandomPassword,
      studentId,
      rollNumber,
      class: studentClass,
      section,
      teacherId,
      subjects,
      qualification,
      experience,
      department,
      children,
      sendWelcomeEmail,
    } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "Name, Email and Role are required" },
        { status: 400 }
      );
    }

    // check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    // password handling
    let finalPassword = password;

    if (generateRandomPassword) {
      finalPassword = Math.random().toString(36).slice(-8) + "@A1";
    }

    if (!finalPassword) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      address,
      role,
      password: hashedPassword,

      // Student
      ...(role === "student" && {
        studentId,
        rollNumber,
        class: studentClass,
        section,
      }),

      // Teacher
      ...(role === "teacher" && {
        teacherId,
        subjects,
        qualification,
        experience,
        department,
      }),

      // Parent
      ...(role === "parent" && {
        children,
      }),

      // Defaults
      isActive: true,
      isVerified: true,
      emailVerified: true,
    });

    // (Optional) Welcome email logic later

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: newUser._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}