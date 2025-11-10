import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";
import {
  generateToken,
  generateRefreshToken,
  getTokenExpirationTime,
} from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, password, providerId, name, image, provider } = body;

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone is required." }, { status: 400 });
    }

    let whereCondition = {};
    if (providerId) {
      whereCondition = {
        providerId,
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      };
    } else {
      whereCondition = {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      };
    }

    let user = await db.user.findFirst({ where: whereCondition });

    // Register user if not found and using social login
    if (providerId && !user) {
      user = await db.user.create({
        data: {
          name: name || "User",
          email: email || null,
          phone: phone || null,
          password: "",
          avatar: image,
          role: "USER",
          provider,
          providerId,
          emailVerified: email ? new Date() : null,
          phoneVerified: phone ? new Date() : null,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "No user found." }, { status: 400 });
    }

    if (user.isDeleted) {
      return NextResponse.json({ error: "Account has been deactivated." }, { status: 403 });
    }

    // Social login verification
    if (providerId) {
      const isVerified = user.emailVerified || user.phoneVerified;
      if (!isVerified) {
        return NextResponse.json(
          { error: "Account not verified. Please verify email or phone.", unverified: true },
          { status: 403 }
        );
      }
    } else {
      // Credentials login checks
      if (email && !user.emailVerified) {
        return NextResponse.json({ error: "Email not verified.", unverified: true }, { status: 403 });
      }

      if (phone && !user.phoneVerified) {
        return NextResponse.json({ error: "Phone not verified.", unverified: true }, { status: 403 });
      }

      if (!user.password) {
        return NextResponse.json({ error: "No password set. Use social login." }, { status: 400 });
      }

      const passwordMatch = await bcryptjs.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Wrong password." }, { status: 400 });
      }
    }

    // 🧪 Generate tokens
    const accessToken = await generateToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      name: user.name,
    });

    const refreshToken = await generateRefreshToken({ id: user.id });

    const accessTokenExpiration = getTokenExpirationTime(accessToken);
    const refreshTokenExpiration = getTokenExpirationTime(refreshToken);

    // 💾 Store only the access token
    await db.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        expires: new Date(accessTokenExpiration * 1000),
      },
    });

    // 🧹 Clean up expired sessions
    await db.session.deleteMany({
      where: {
        userId: user.id,
        expires: {
          lt: new Date(),
        },
      },
    });

    const { id, name: userName, email: userEmail, phone: userPhone, role, avatar } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id,
          name: userName,
          email: userEmail,
          phone: userPhone,
          role,
          avatar,
        },
        tokens: {
          accessToken,
          refreshToken,
          accessTokenExpiresIn: "7d",
          refreshTokenExpiresIn: "30d",
          accessTokenExpirationTime: accessTokenExpiration,
          refreshTokenExpirationTime: refreshTokenExpiration,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
