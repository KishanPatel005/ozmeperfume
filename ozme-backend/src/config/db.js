import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ozme';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server will continue without database connection.');
    console.warn('⚠️ Some features may not work. Please start MongoDB and restart the server.');
    console.warn('💡 To start MongoDB:');
    console.warn('   - Windows: net start MongoDB (or start MongoDB service)');
    console.warn('   - Mac/Linux: brew services start mongodb-community (or sudo systemctl start mongod)');
    console.warn('   - Or use MongoDB Atlas (cloud): Update MONGO_URI in .env');
    // Don't exit - allow server to start without DB for development
  }
};

/**
 * Check if MongoDB is connected
 * @returns {boolean}
 */
export const isDBConnected = () => isConnected;

export default connectDB;

