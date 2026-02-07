import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/models/Exam";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params; // MUST match [id] folder name

    const { subjectIndex, teacherId } = await req.json();

    const exam = await Exam.findById(id);
    if (!exam) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    exam.subjects[subjectIndex].teacherId = teacherId;
    await exam.save();

    return NextResponse.json({ message: "Teacher assigned successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
