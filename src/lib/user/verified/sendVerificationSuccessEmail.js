import transporter from "@/lib/mail/mail";

export async function sendVerificationSuccessEmail(to) {
  const companyName = process.env.NEXT_PUBLIC_WEBSITE_NAME ;
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ;

  await transporter.sendMail({
    from: `"${companyName}" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Email Has Been Verified Successfully!",
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <p>Hello,</p>
        <p>Thank you for verifying your email address. Your email <strong>${to}</strong> has been successfully verified.</p>
        <p>Welcome aboard! 🎉</p>
        <p>Best regards,<br/>The ${companyName} Team</p>
        <p style="font-size: 12px;">Visit us at <a href="${websiteUrl}" target="_blank">${websiteUrl}</a></p>
      </div>
    `,
  });
}
