import {auth} from "@/auth";
import { NextResponse } from "next/server";
import type { User } from "@/model/user.model";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

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

    // get user id from session user for mongoose aggregation pipeline
    const userId = new mongoose.Types.ObjectId(user._id as string);

    try {
        const foundUser = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: {
                    path: "$messages"
                }
            },
            {
                $sort: {
                    "messages.createdAt": -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ]);

        if (!foundUser || foundUser.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            },
            { status: 404 }
        );
        }

        return NextResponse.json({
            success: true,
            message: "Messages retrieved successfully",
            messages: foundUser[0].messages
        },
        { status: 200 }
    );
    } catch (error) {
        console.error("An unexpected error occurred while getting messages: ", error);
        return NextResponse.json({
            success: false,
            message: "Error in getting messages"
        },
        { status: 500 }
    );
    }
}