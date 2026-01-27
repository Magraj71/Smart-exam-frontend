// lib/email.ts
import nodemailer from 'nodemailer';

// Configure transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string, 
  name: string, 
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"SmartExam System" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Verify Your Email - SmartExam",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to SmartExam!</h1>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hello ${name},</p>
          <p style="font-size: 16px; color: #374151;">Thank you for registering with SmartExam. Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link in your browser:</p>
          <p style="font-size: 14px; color: #6b7280; word-break: break-all;">${verificationUrl}</p>
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">This link will expire in 24 hours.</p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>If you didn't create an account with SmartExam, please ignore this email.</p>
          <p>© ${new Date().getFullYear()} SmartExam System. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(
  email: string, 
  name: string, 
  role: string
) {
  const roleMessages: Record<string, string> = {
    student: "Track your academic progress, view results, and access study materials.",
    teacher: "Manage your classes, create exams, and evaluate student performance.",
    parent: "Monitor your child's academic performance and stay updated with their progress.",
    admin: "Manage the entire system, users, and academic operations."
  };

  const roleFeatures: Record<string, string[]> = {
    student: [
      "View and download your results",
      "Access study materials and resources",
      "Track your attendance",
      "Get exam notifications",
      "View performance analytics"
    ],
    teacher: [
      "Create and manage exams",
      "Upload student marks",
      "Generate question papers",
      "Track class performance",
      "Communicate with students"
    ],
    parent: [
      "View child's academic progress",
      "Monitor attendance",
      "Receive performance alerts",
      "Access report cards",
      "Communicate with teachers"
    ],
    admin: [
      "Manage all user accounts",
      "Oversee academic operations",
      "Generate system reports",
      "Configure system settings",
      "Manage institutions and classes"
    ]
  };

  const features = roleFeatures[role] || [];
  const featuresHtml = features.map(feature => `
    <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
      <span style="position: absolute; left: 0; color: #10b981;">✓</span> ${feature}
    </li>
  `).join('');

  const mailOptions = {
    from: `"SmartExam System" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: `Welcome to SmartExam - ${role.charAt(0).toUpperCase() + role.slice(1)} Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0 0 10px 0; font-size: 32px;">Welcome ${name}!</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your ${role} account has been successfully created.</p>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            We're excited to have you join the SmartExam community. ${roleMessages[role]}
          </p>
          <div style="background-color: white; border-radius: 8px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #111827; margin-top: 0;">Your Account Features:</h3>
            <ul style="color: #4b5563; padding-left: 0; list-style: none;">
              ${featuresHtml}
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Go to Dashboard</a>
          </div>
          <p style="font-size: 14px; color: #6b7280; border-left: 4px solid #10b981; padding-left: 15px; margin: 30px 0;">
            <strong>Need help?</strong> Visit our <a href="${process.env.NEXTAUTH_URL}/help" style="color: #10b981;">Help Center</a> or contact our support team.
          </p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} SmartExam System. Intelligent Education Management Platform.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Add more email functions as needed
export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"SmartExam System" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Reset Your Password - SmartExam",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hello ${name},</p>
          <p style="font-size: 16px; color: #374151;">You requested to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link in your browser:</p>
          <p style="font-size: 14px; color: #6b7280; word-break: break-all;">${resetUrl}</p>
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">This link will expire in 1 hour.</p>
          <p style="font-size: 14px; color: #6b7280;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>© ${new Date().getFullYear()} SmartExam System. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}