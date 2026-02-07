import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/models/Exam";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = verifyToken(token);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();

    const exam = await Exam.create({
      ...body,
      createdBy: decoded.id,
    });

    return NextResponse.json({ message: "Exam created", exam }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const exams = await Exam.find().sort({ createdAt: -1 });
  return NextResponse.json({ exams });
}
