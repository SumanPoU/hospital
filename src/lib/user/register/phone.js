import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendVerificationSMS(phone, code) {
  try {
    const message = await twilioClient.messages.create({
      body: `Your verification code is: ${code}\n— sumanALERT`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log("Twilio SMS sent:", message.sid);
  } catch (error) {
    console.error("Twilio SMS Error:", error.message);
    throw new Error("Twilio SMS sending failed");
  }
}

export async function sendPasswordResetVerificationSMS(phone, code) {
  try {
    const message = await twilioClient.messages.create({
      body: `Use this code to reset your password: ${code}\nThis code is valid for 3 minutes.\n— sumanALERT`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log("Password reset SMS sent:", message.sid);
  } catch (error) {
    console.error("Password reset SMS Error:", (error).message);
    throw new Error("Failed to send password reset SMS");
  }
}