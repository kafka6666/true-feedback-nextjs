import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { User } from "@/model/user.model";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
): Promise<NextResponse> {
    await dbConnect();

    const messageId = (await params).messageId;

    // get session from auth
    const session = await auth();

    // check if user is authenticated
    const user = session?.user as User;
    if (!session || !user) {
        return NextResponse.json(
            { success: false, message: "User not authenticated" },
            { status: 401 }
        );
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (!updatedResult || updatedResult.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Failed to delete message" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in deleting message: ", error);
        return NextResponse.json(
            { success: false, message: "Error deleting message" },
            { status: 500 }
        );
    }
}
