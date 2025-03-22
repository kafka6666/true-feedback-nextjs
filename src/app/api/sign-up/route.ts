import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: NextRequest) {

    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        // check whether the username is already taken, and if taken, is already verified
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingUserVerifiedByUsername) {
            return NextResponse.json(
                { 
                    success: false,
                    message: "Username is already taken" 
                }, 
                { status: 400 }
            );
        }

        // check the user by email
        const existingUserByEmail = await UserModel.findOne({email});

        // generate a random 6-digit verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail?.isVerified) {
            return NextResponse.json(
                { 
                    success: false,
                    message: "This email is already registered" 
                }, 
                { status: 400 }
            );
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail!.password = hashedPassword;
            existingUserByEmail!.verifyCode = verifyCode;
            existingUserByEmail!.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail!.save();
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        // create new user
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages: []
        });

        // save the user to db
        await newUser.save();

        // send verification email and handle the response
        const emailResponse = await sendVerificationEmail({
            email: newUser.email,
            username: newUser.username,
            otp: newUser.verifyCode
        });

        if (!emailResponse.success) {
            return NextResponse.json(
                { 
                    success: false,
                    message: emailResponse.message
                }, 
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                success: true,
                message: "User registered successfully. Please verify your email to complete registration."
            }, 
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in sign-up route", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Error in registering user" 
            }, 
            { status: 500 }
        );
    }
}
