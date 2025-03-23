import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from "zod";
import { NextRequest, NextResponse } from "next/server";
import {usernameValidation} from "@/schemas/signUpSchema";

const UserQueryNameSchema = z.object({
    username: usernameValidation
});

export async function GET(request: NextRequest): Promise<NextResponse> {
    await dbConnect();
    
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }

        // validate with zod
        const validatedData = UserQueryNameSchema.safeParse(queryParam);

        if (!validatedData.success) {
            const usernameErrors = validatedData.error.format().username?._errors || [];
            return NextResponse.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 
                    ? usernameErrors.join(', ') 
                    : "Invalid query parameter"
                },
                {status: 400}
            );
        }

        // check if username is already taken
        const {username} = validatedData.data;
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true});
        if (existingVerifiedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {status: 400}
            );
        }

        // return if username is available
        return NextResponse.json(
            {
                success: true,
                message: "Username is available"
            },
            {status: 200}
        );
    } catch (error) {
        console.log("Error in check-usrnm-unique route:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500}
        );
    }
}