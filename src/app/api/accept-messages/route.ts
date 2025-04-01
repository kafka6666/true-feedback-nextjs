import {auth} from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { User } from "@/model/user.model";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest): Promise<NextResponse> {
    await dbConnect();
    
    // get session from auth
    const session = await auth();
    console.log(session);

    // check if user is authenticated
    const user = session?.user as User;
    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "User not authenticated"
        }, 
        { status: 401 }
    );
    }

    const userId = user._id as string;
    const {acceptMessages} = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessages: acceptMessages as string},
            {new: true}
        );

        // check if user is found
        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "User not found and, hence, not updated"
            },
            { status: 404 }
        );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update user status to accept messages: ", error);
        return NextResponse.json({
            success: false,
            message: "Failed to update user status to accept messages"
        },
        { status: 500 }
    );
    }
}

export async function GET(): Promise<NextResponse> {
    await dbConnect();

    // get session from auth
    const session = await auth();
    console.log(session);

    // check if user is authenticated
    const user = session?.user as User;
    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "User not authenticated"
        }, 
        { status: 401 }
    );
    }

    const userId = user._id as string;
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            },
            { status: 404 }
        );
        }

        return NextResponse.json(
            {
                success: true,
                message: "User found successfully",
                isAcceptingMessage: foundUser.isAcceptingMessage
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to get user status to accept messages: ", error);
        return NextResponse.json({
            success: false,
            message: "Error in getting accepting messages acceptance status"
        },
        { status: 500 }
    );
    }
}