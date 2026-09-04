import mongoose from 'mongoose';

let mongoMemoryServerInstance = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/humac_medical';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[DB] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[DB] Standard MongoDB connection to ${mongoUri} failed: ${err.message}`);
    console.log('[DB] Attempting automatic in-memory MongoDB fallback...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServerInstance = await MongoMemoryServer.create();
      const memUri = mongoMemoryServerInstance.getUri();
      
      const conn = await mongoose.connect(memUri);
      console.log(`[DB] Connected to In-Memory MongoDB at ${memUri}`);
      console.log('[DB] Note: Running in zero-config In-Memory Mode. Auto-seeding initial database...');
      
      const { seedDatabase } = await import('../seeds/seed.js');
      await seedDatabase(false);
      return conn;
    } catch (fallbackErr) {
      console.error('[DB] Critical: Failed to connect to MongoDB or initialize in-memory instance:', fallbackErr.message);
      throw fallbackErr;
    }
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (mongoMemoryServerInstance) {
    await mongoMemoryServerInstance.stop();
  }
};
