import mongoose from "mongoose";

export async function connectdb() {

    try {
        const isDev = process.env.NODE_ENV !== 'production'
        const mongoString = isDev ? process.env.MONGO_URI_dev : process.env.MONGO_URI_PROD
        if (!mongoString) {
            throw new Error("MongoDB connection string missing")
        }
        await mongoose.connect(mongoString)
        console.log(
            `MongoDB connected (${isDev ? "Development" : "Production"})`
        );
    } catch (error) {
        console.error('Error While connecting mongodb: ', error)
        process.exit(1);
    }
}
