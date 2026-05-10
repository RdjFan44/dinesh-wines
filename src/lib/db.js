import mongoose from 'mongoose';

let cached = global.mongoose;
let mongoServer = global._mongoServer;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  let uri = process.env.MONGODB_URI;

  // In production, a real MongoDB URI is mandatory
  if (process.env.NODE_ENV === 'production') {
    if (!uri) {
      throw new Error(
        'MONGODB_URI environment variable is not set. ' +
        'Add it in Vercel → Settings → Environment Variables.'
      );
    }
  }

  // In development, fall back to an in-memory server if no real URI is set
  if (!uri || uri.includes('<username>')) {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      if (!mongoServer) {
        mongoServer = global._mongoServer = await MongoMemoryServer.create({
          binary: {
            downloadDir: `${process.env.USERPROFILE || process.env.HOME}/.cache/mongodb-binaries`,
            version: '8.2.1',
            skipMD5: true,
          },
          instance: { storageEngine: 'wiredTiger' },
        });
      }
      uri = mongoServer.getUri();
      console.log('[db] Using in-memory MongoDB for local dev');
    } catch {
      throw new Error(
        'No MONGODB_URI set and mongodb-memory-server is not available. ' +
        'Run `npm install` or set a real MONGODB_URI.'
      );
    }
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
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

