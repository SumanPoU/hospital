import { NextResponse } from "next/server";
import db from "@/lib/db";
import { sendVerificationSuccessEmail } from "@/lib/user/verified/sendVerificationSuccessEmail";
import { sendVerificationSuccessSMS } from "@/lib/user/verified/sendVerificationSuccessSMS";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { email, phone, code } = await request.json();

        if ((!email && !phone) || !code) {
            return NextResponse.json({ error: "Email or phone and code are required." }, { status: 400 });
        }

        const user = await db.user.findFirst({
            where: {
                OR: [
                    email ? { email } : undefined,
                    phone ? { phone } : undefined,
                ].filter(Boolean),
            },
            include: {
                verificationTokens: {
                    where: {
                        token: code,
                        expires: { gt: new Date() },
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        // Find matching verification token
        const tokenRecord = user.verificationTokens.find(t => t.token === code);
        if (!tokenRecord) {
            return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
        }

        // Prepare update data and message
        let updateData = {};
        let successMessage = "";
        let notifyPromise = null;

        if (email && tokenRecord.type === "EMAIL_VERIFICATION") {
            if (user.emailVerified) {
                return NextResponse.json({ message: "Email already verified." }, { status: 200 });
            }
            updateData = { emailVerified: new Date() };
            successMessage = `Email ${email} verified successfully.`;
            notifyPromise = sendVerificationSuccessEmail(email);
        } else if (phone && tokenRecord.type === "PHONE_VERIFICATION") {
            if (user.phoneVerified) {
                return NextResponse.json({ message: "Phone already verified." }, { status: 200 });
            }
            updateData = { phoneVerified: new Date() };
            successMessage = `Phone number ${phone} verified successfully.`;
            notifyPromise = sendVerificationSuccessSMS(phone);
        } else {
            return NextResponse.json({ error: "Verification type mismatch." }, { status: 400 });
        }

        // Update user verification timestamp
        await db.user.update({
            where: { id: user.id },
            data: updateData,
        });

        // Delete used verification token
        await db.verificationToken.delete({
            where: { id: tokenRecord.id },
        });

        // Await sending confirmation notification
        if (notifyPromise) await notifyPromise;

        return NextResponse.json({ message: successMessage }, { status: 200 });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
