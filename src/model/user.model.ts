import mongoose, { Document, Schema, Model } from "mongoose";

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

// Fix for Edge Runtime: use a function to get the model that safely handles both server and edge environments
function getModel<T extends Document>(
  modelName: string, 
  schema: Schema
): Model<T> {
  // This is for Edge Runtime safety - wrap in try/catch
  try {
    // First try to get the existing model
    return (mongoose.models[modelName] as Model<T>) || 
           mongoose.model<T>(modelName, schema);
  } catch (error) {
    // If in Edge Runtime and models is undefined, just return a mock model
    // This will allow the code to parse but actual DB operations should happen in API routes
    if (process.env.NEXT_RUNTIME === 'edge') {
      // Return a minimal mock for Edge Runtime
      return {} as Model<T>;
    }
    
    // For other errors, attempt to create the model
    return mongoose.model<T>(modelName, schema);
  }
}

// Use the safer function to get the model
const UserModel = getModel<User>("User", userSchema);

export default UserModel;
