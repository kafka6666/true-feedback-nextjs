import { resend } from "@/lib/resendEmail";
import VerificationEmail from "@/components/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

interface SendVerificationEmail{
    email: string;
    username: string;
    otp: string;
}

export async function sendVerificationEmail({email, username, otp}: SendVerificationEmail): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "True Feedback <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email address",
            react: VerificationEmail({ username, otp }),
        });
        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Error sending verification email", error);
        return { success: false, message: "Failed to send verification email" };
    }
}

