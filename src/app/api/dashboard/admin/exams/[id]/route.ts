import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/models/Exam";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }   // ⭐ params is Promise
) {
  try {
    await connectDB();

    const { id } = await context.params;   // ⭐ unwrap params

    console.log("Exam ID:", id);

    const exam = await Exam.findById(id);

    if (!exam) {
      return NextResponse.json(
        { message: "Exam not found" },
        { status: 404 }
      );
    }

    console.log("Exam found:", exam);

    return NextResponse.json({ exam }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
