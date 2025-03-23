import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongoose";

// Define a custom adapter type that works with Mongoose
type MongooseUser = {
  _id: ObjectId | string;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
}

// Use API routes instead of direct DB access from auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      // Fix the authorize function signature and return type
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          await dbConnect();
          // Find the user in the database
          const userDoc = await UserModel.findOne({ email: credentials.email });
          if (!userDoc) {
            return null;
          }
          
          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string, 
            userDoc.password as string
          );
          
          if (!isPasswordValid) {
            return null;
          }
          
          // Convert Mongoose document to a plain object
          const user = userDoc.toObject();
          
          // Ensure _id is a string (Auth.js expects string IDs)
          return {
            id: user._id as string, // Auth.js expects 'id', not '_id'
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isAcceptingMessage: user.isAcceptingMessage,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id as string;
        token.username = user.username;
        token.email = user.email as string;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
})