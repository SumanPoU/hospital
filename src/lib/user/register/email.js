import transporter from "@/lib/mail/mail";

const COMPANY_NAME = process.env.NEXT_PUBLIC_WEBSITE_NAME;
const COMPANY_EMAIL = process.env.SMTP_USER;

export const sendVerificationEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"${COMPANY_NAME} - Registration" <${COMPANY_EMAIL}>`,
    to,
    subject: `Verify your email - ${COMPANY_NAME}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5">
        <p>Hello,</p>
        <p>Your verification code is:</p>
        <h2 style="color: #4caf50;">${code}</h2>
        <p>This code will expire in 3 minutes.</p>
        <p>Thank you,<br/>The ${COMPANY_NAME} Team</p>
      </div>
    `,
  });
};

export const sendPasswordResetVerificationEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"${COMPANY_NAME} - Password Reset" <${COMPANY_EMAIL}>`,
    to,
    subject: `Reset Your Password - ${COMPANY_NAME}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5">
        <p>Hello,</p>
        <p>We received a request to reset your password. Use the code below to proceed:</p>
        <h2 style="color: #4caf50;">${code}</h2>
        <p>This code is valid for 3 minutes. If you didn't request this, you can safely ignore this email.</p>
        <p>Thank you,<br/>The ${COMPANY_NAME} Team</p>
      </div>
    `,
  });
};

