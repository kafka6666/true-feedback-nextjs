import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

// Initialize connection object
const connection: ConnectionObject = {};

// function to connect to MongoDB
async function dbConnect(): Promise<void> {
    // Check if already connected
    if (connection.isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }
    
    // Make sure MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in environment variables");
        throw new Error("MONGODB_URI is not defined");
    }
    
    // Connect to MongoDB
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!, {});
        
        // Set the connection state
        connection.isConnected = db.connections[0].readyState;
        
        // Log connection state
        if (connection.isConnected === 1) {
            console.log("Connected to MongoDB successfully");
        } else {
            console.log(`MongoDB connection state: ${connection.isConnected}`);
        }
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}

export default dbConnect;