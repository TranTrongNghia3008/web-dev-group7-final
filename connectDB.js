const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://admin:3erkkrKTy2EJBjUl@webdev-21tn-group7.dmacvr7.mongodb.net/tms-v01?retryWrites=true&w=majority&appName=WebDev-21TN-Group7', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
