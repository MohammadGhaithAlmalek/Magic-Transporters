import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database.
 * 
 * This function establishes a connection to the MongoDB database using mongoose. It logs a success message to the console if the connection is successful. 
 * If the connection fails, it logs the error message and exits the process with a non-zero status code.
 * 
 * @async
 * @throws {Error} - Throws an error if the connection to the database fails.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using Mongoose
    const conn = await mongoose.connect('mongodb://mongodb:27017/magicTransporters');
    
    // Log the successful connection details
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error if connection fails and exit the process
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process with a failure status code
  }
};

export default connectDB;
