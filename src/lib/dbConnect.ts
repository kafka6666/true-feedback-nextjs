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
    // Connect to MongoDB
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!, {});
        console.log(db);
        
        // Set the connection state
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

export default dbConnect;