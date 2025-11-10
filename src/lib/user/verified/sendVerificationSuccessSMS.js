import twilio from "twilio";

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export async function sendVerificationSuccessSMS(phone) {
    try {
        const message = await twilioClient.messages.create({
            body: `Your phone number ${phone} has been successfully verified! Welcome aboard! 🎉`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });
        console.log("Twilio confirmation SMS sent:", message.sid);
    } catch (error) {
        console.error("Twilio SMS sending error:", error.message);
        throw new Error("Failed to send SMS confirmation");
    }
}
