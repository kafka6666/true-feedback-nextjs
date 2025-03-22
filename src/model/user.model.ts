import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export const messageSchema = new Schema<Message>({
    content: { 
        type: String, 
        required: true
    },
    createdAt: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

export const userSchema = new Schema<User>({
    username: { 
        type: String, 
        required: [true, "Username is required"], 
        trim: true, 
        lowercase: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: [true, "Email is required"],
        match: [/.+\@.+\..+/, "Please use a valid email address"],
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, "Password is required"] 
    },
    verifyCode: { 
        type: String, 
        required: [true, "Verify code is required"] 
    },
    verifyCodeExpiry: { 
        type: Date, 
        required: [true, "Verify code expiry is required"] 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    isAcceptingMessage: { 
        type: Boolean, 
        default: true 
    },
    messages: [messageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel;
