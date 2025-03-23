import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    await dbConnect();
    
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return NextResponse.json(
                { 
                    success: false,
                    message: "User not found" 
                },
                { status: 404 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
        
        // check if the user verify code and code expiry are valid
        if (!isCodeValid) {
            return NextResponse.json(
                { 
                    success: false,
                    message: "Incorrect verification code" 
                },
                { status: 400 }
            );
        } else if (isCodeExpired) {
            return NextResponse.json(
                { 
                    success: false,
                    message: "Verification code has expired. Please sign up again to get a new code." 
                },
                { status: 400 }
            );
        }

        // update user verification status and send response accordingly
        user.isVerified = true;
        await user.save();

        return NextResponse.json(
            { 
                success: true,
                message: "User verified successfully" 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Verify user error:", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Error in verifying user" 
            },
            { status: 500 }
        );
    }
}