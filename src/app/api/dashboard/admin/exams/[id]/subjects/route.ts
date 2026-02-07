import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/models/Exam";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params; // ✅ Next 16 fix

  const cookieStore = await cookies(); // also async in latest Next
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded: any = verifyToken(token);

  if (decoded.role !== "admin")
    return NextResponse.json({ message: "Access denied" }, { status: 403 });

  const body = await req.json();
  const { subjectIds } = body;

  console.log("Exam ID:", id);
  console.log("Subjects:", subjectIds);

  const exam = await Exam.findById(id);

  if (!exam)
    return NextResponse.json({ message: "Exam not found" }, { status: 404 });

  exam.subjects = subjectIds;
  await exam.save();

  return NextResponse.json({
    message: "Subjects assigned successfully",
    exam,
  });
}
