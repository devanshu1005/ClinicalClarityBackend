const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

function getMongoUri() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it to your .env file.');
  }

  try {
    new URL(mongoUri);
  } catch {
    throw new Error('MONGO_URI is not a valid MongoDB connection string.');
  }

  console.log("returning mongo url")
  return mongoUri;
}

async function startServer() {
  try {
    console.log('trying to connect mongo db');
    await mongoose.connect(getMongoUri());
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    if (error.message.includes('bad auth') || error.message.includes('authentication failed')) {
      console.error('Check the MongoDB username/password in MONGO_URI and make sure the database user exists in MongoDB Atlas.');
    }
    process.exit(1);
  }
}

startServer();
