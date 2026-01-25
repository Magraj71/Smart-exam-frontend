import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // ✅ FIX: await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = verifyToken(token);

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}
