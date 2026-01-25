import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({
      id: user._id,
      role: user.role,
    });

    const res = NextResponse.json({
      message: "Login successful",
      role: user.role,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
