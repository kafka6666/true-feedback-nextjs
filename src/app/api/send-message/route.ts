import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Message } from "@/model/user.model";
import UserModel from "@/model/user.model";

export async function POST(req: NextRequest): Promise<NextResponse> {
    await dbConnect();

    // get username and message from request body
    const { username, content } = await req.json();

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { 
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        // check whether user is accepting messages
        if (!user.isAcceptingMessage) {
            return NextResponse.json(
                { 
                    success: false,
                    message: "User is not accepting messages"
                },
                { status: 403 }
            );
        }

        // create new message
        const newMessage = {
            content,
            createdAt: new Date()

        } as Message;

        // add new message to user's messages
        user.messages.push(newMessage);

        // save user
        await user.save();

        return NextResponse.json(
            { 
                success: true,
                message: "Message sent successfully"
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("An unexpected error occurred while sending message: ", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Internal server error while sending message"
            },
            { status: 500 }
        );
    }
    
}