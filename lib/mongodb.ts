import mongoose from 'mongoose';



/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    // Force a fresh read of the environment
    const MONGODB_URI = process.env.MONGODB_URI || process.env.NEXT_AT_MONGODB_URI;

    if (!MONGODB_URI) {
        const availableKeys = Object.keys(process.env).filter(key =>
            !key.includes('PASS') && !key.includes('SECRET') && !key.includes('KEY') && !key.includes('TOKEN')
        ).join(', ');

        console.error("❌ MONGODB_URI not found. Available env keys:", availableKeys);
        throw new Error(`MONGODB_URI is missing in AWS Runtime. See server logs for available keys.`);
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 30000,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
