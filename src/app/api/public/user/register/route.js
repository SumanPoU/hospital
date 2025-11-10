import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/lib/user/register/email";
import { sendVerificationSMS } from "@/lib/user/register/phone";
import {
  filterUserFields,
  generateVerificationCode,
  isStrongPassword,
  isValidEmail,
  isValidPhoneNumber
} from "@/lib/user/authHelpers";
import { allowedRoles, TokenType } from "@/lib/enums/enums";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      password,
      role = "USER",
      image,
      provider,
      providerId
    } = body;

    console.log(body)
    // Validate name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    // Validate role
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    // At least one of email, phone, or providerId is required
    if (!email && !phone && !providerId) {
      return NextResponse.json(
        { error: "Email, phone number, or providerId is required." },
        { status: 400 }
      );
    }

    const isSocialLogin = !!providerId;

    // Validate email
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Validate phone
    if (phone && !isValidPhoneNumber(phone)) {
      return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
    }

    // Validate password if not using social login
    if (!isSocialLogin) {
      if (!password || typeof password !== "string" || !isStrongPassword(password)) {
        return NextResponse.json({
          error:
            "Password must be at least 6 characters and include uppercase, lowercase, number, and special character."
        }, { status: 400 });
      }
    }

    // Check for existing user by email or phone or providerId
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined,
          providerId ? { providerId } : undefined
        ].filter(Boolean)
      }
    });

    if (existingUser) {
      return NextResponse.json({
        error: "User already exists with this email, phone number, or provider.",
        unverified: !existingUser.emailVerified || !existingUser.phoneVerified
      }, { status: 409 });
    }

    const hashedPassword = password ? await bcryptjs.hash(password, 10) : undefined;

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        avatar: image,
        provider,
        providerId,
        emailVerified: email ? null : undefined,
        phoneVerified: phone ? null : undefined
      }
    });

    const verificationCode = generateVerificationCode();
    const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

    // Store verification token if needed
    if (!isSocialLogin) {
      if (email) {
        await db.verificationToken.create({
          data: {
            userId: user.id,
            token: verificationCode,
            type: TokenType.EMAIL_VERIFICATION,
            expires: expiry
          }
        });
        await sendVerificationEmail(email, verificationCode);
      }

      if (phone) {
        await db.verificationToken.create({
          data: {
            userId: user.id,
            token: verificationCode,
            type: TokenType.PHONE_VERIFICATION,
            expires: expiry
          }
        });
        await sendVerificationSMS(phone, verificationCode);
      }
    }

    return NextResponse.json({
      user: filterUserFields(user),
      message: isSocialLogin
        ? "User registered via social provider."
        : `Verification ${email ? "email" : "SMS"} sent. Please check your ${email ? "inbox" : "phone"}.`
    }, { status: 201 });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
