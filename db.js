const mongoose = require('mongoose');
module.exports.connectDB = async (uri)=>{
  const u = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack_roleguard';
  try{
    await mongoose.connect(u, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');
  }catch(err){
    console.error('Failed to connect to MongoDB at', u);
    console.error('Error:', err.message || err);
    console.error('Make sure MongoDB is running. The server will continue but DB operations may fail.');
  }
};
