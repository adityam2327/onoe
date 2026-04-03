import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        //const mongoURI = process.env.NODE_ENV === "production" ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL;
         const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const connIns = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${connIns.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
}