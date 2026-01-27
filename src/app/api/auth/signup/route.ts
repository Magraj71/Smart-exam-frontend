// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      name, 
      email, 
      password, 
      role,
      // Common optional fields
      phone,
      address,
      // Student fields
      rollNumber,
      class: studentClass,
      section,
      dateOfBirth,
      gender,
      bloodGroup,
      parentEmail,
      // Teacher fields
      qualification,
      experience,
      department,
      subjects,
      joiningDate,
      // Parent fields
      parentName,
      childrenEmails
    } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['admin', 'teacher', 'student', 'parent'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: "Invalid role specified" }, 
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" }, 
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" }, 
        { status: 400 }
      );
    }

    // Variables to store parent linking info
    let parentIdToLink = null;
    let parentUserFound = null;

    // Role-specific validations
    if (role === "student") {
      if (!rollNumber || !studentClass) {
        return NextResponse.json(
          { message: "Roll number and class are required for students" }, 
          { status: 400 }
        );
      }

      // Check if roll number already exists
      const existingRollNumber = await User.findOne({ rollNumber });
      if (existingRollNumber) {
        return NextResponse.json(
          { message: "Roll number already exists" }, 
          { status: 400 }
        );
      }

      // Check if parent email exists (if provided) - Make it OPTIONAL
      if (parentEmail) {
        parentUserFound = await User.findOne({ 
          email: parentEmail, 
          role: "parent" 
        });
        
        if (parentUserFound) {
          parentIdToLink = parentUserFound._id;
        }
        // If parent not found, don't return error - just skip linking
        // Student can link parent later
      }
    }

    if (role === "teacher") {
      if (!qualification || !department) {
        return NextResponse.json(
          { message: "Qualification and department are required for teachers" }, 
          { status: 400 }
        );
      }
    }

    if (role === "parent") {
      if (!parentName) {
        return NextResponse.json(
          { message: "Parent name is required" }, 
          { status: 400 }
        );
      }

      // Validate children emails (if provided) - Make it OPTIONAL
      if (childrenEmails && childrenEmails.length > 0) {
        const children = await User.find({ 
          email: { $in: childrenEmails },
          role: "student"
        });
        
        // Don't return error if some children not found
        // Parent can link children later
        if (children.length > 0) {
          // We'll link found children later
        }
      }
    }

    // Admin registration restriction (only by existing admins)
    if (role === "admin") {
      // Check if there's an admin in the system
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        // For subsequent admin registrations, check authorization token
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json(
            { message: "Admin registration requires authorization" }, 
            { status: 401 }
          );
        }

        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          const requestingUser = await User.findById(decoded.id);
          
          if (!requestingUser || requestingUser.role !== 'admin') {
            return NextResponse.json(
              { message: "Only admins can create new admin accounts" }, 
              { status: 403 }
            );
          }
        } catch (error) {
          return NextResponse.json(
            { message: "Invalid authorization token" }, 
            { status: 401 }
          );
        }
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const emailVerificationToken = jwt.sign(
      { email },
      JWT_SECRET + email,
      { expiresIn: '24h' }
    );

    // Generate IDs based on role
    let generatedStudentId = undefined;
    let generatedTeacherId = undefined;
    
    if (role === "student") {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      generatedStudentId = `STU${year}${random}`;
    }
    
    if (role === "teacher") {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      generatedTeacherId = `TCH${year}${random}`;
    }

    // Prepare user data
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      emailVerificationToken,
      notificationPreferences: {
        email: true,
        sms: false,
        push: true
      },
      // Add generated IDs
      ...(generatedStudentId && { studentId: generatedStudentId }),
      ...(generatedTeacherId && { teacherId: generatedTeacherId })
    };

    // Add role-specific data
    if (role === "student") {
      userData.rollNumber = rollNumber;
      userData.class = studentClass;
      userData.section = section || 'A';
      userData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
      userData.gender = gender || 'male';
      userData.bloodGroup = bloodGroup;
      userData.enrollmentDate = new Date();
      
      // Link parent if found
      if (parentIdToLink) {
        userData.parentId = parentIdToLink;
      }
    }

    if (role === "teacher") {
      userData.qualification = qualification;
      userData.experience = parseInt(experience) || 0;
      userData.department = department;
      userData.subjects = subjects || [];
      userData.joiningDate = joiningDate ? new Date(joiningDate) : new Date();
    }

    if (role === "parent") {
      userData.name = parentName;
      // Link children by email (only those that exist)
      if (childrenEmails && childrenEmails.length > 0) {
        const children = await User.find({ 
          email: { $in: childrenEmails },
          role: "student"
        });
        if (children.length > 0) {
          userData.children = children.map(child => child._id);
        }
      }
    }

    // Create user
    const user = await User.create(userData);

    // Update parent's children list if student registered with parent
    if (role === "student" && user.parentId) {
      await User.findByIdAndUpdate(
        user.parentId,
        { $addToSet: { children: user._id } }
      );
    }

    // If parent registered with children, update children's parentId
    if (role === "parent" && user.children && user.children.length > 0) {
      await User.updateMany(
        { _id: { $in: user.children } },
        { $set: { parentId: user._id } }
      );
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, name, emailVerificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue even if email fails
    }

    // Send welcome email based on role
    try {
      await sendWelcomeEmail(email, name, role);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    // Create JWT token for immediate login (optional)
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare response data
    const responseData: any = {
      message: "Registration successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.emailVerified
      },
      token
    };

    // Add role-specific data to response
    if (role === "student") {
      responseData.user.rollNumber = user.rollNumber;
      responseData.user.class = user.class;
      responseData.user.section = user.section;
      responseData.user.studentId = user.studentId || generatedStudentId;
      if (user.parentId) {
        responseData.user.parentLinked = true;
      } else if (parentEmail) {
        responseData.user.parentEmailProvided = true;
        responseData.user.parentNotRegistered = true;
        responseData.message = "Registration successful! Note: Parent email not found. You can link parent later from dashboard.";
      }
    }

    if (role === "teacher") {
      responseData.user.teacherId = user.teacherId || generatedTeacherId;
      responseData.user.department = user.department;
    }

    if (role === "parent") {
      responseData.user.childrenCount = user.children?.length || 0;
      if (childrenEmails && childrenEmails.length > 0 && user.children?.length === 0) {
        responseData.user.childrenNotLinked = true;
        responseData.message = "Registration successful! Note: No children found with provided emails. You can link children later.";
      }
    }

    // Set cookie for immediate login
    const response = NextResponse.json(responseData);
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return response;

  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors: messages }, 
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Registration failed. Please try again." }, 
      { status: 500 }
    );
  }
}

// Optional: Add GET method to check email availability
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const rollNumber = searchParams.get('rollNumber');

    if (!email && !rollNumber) {
      return NextResponse.json(
        { message: "Email or roll number required" }, 
        { status: 400 }
      );
    }

    await connectDB();

    if (email) {
      const existingUser = await User.findOne({ email });
      return NextResponse.json({ 
        available: !existingUser,
        message: existingUser ? "Email already registered" : "Email available"
      });
    }

    if (rollNumber) {
      const existingUser = await User.findOne({ rollNumber });
      return NextResponse.json({ 
        available: !existingUser,
        message: existingUser ? "Roll number already exists" : "Roll number available"
      });
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Check availability error:", error);
    return NextResponse.json(
      { message: "Failed to check availability" }, 
      { status: 500 }
    );
  }
}