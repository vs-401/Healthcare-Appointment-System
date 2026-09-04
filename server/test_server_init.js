import { connectDB, closeDB } from './config/db.js';

async function testInit() {
  try {
    console.log('[TEST] Initializing database connection...');
    await connectDB();
    console.log('[TEST] Database connected and initialized successfully!');
    await closeDB();
    console.log('[TEST] Closed database cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('[TEST] Critical failure:', err);
    process.exit(1);
  }
}

testInit();
