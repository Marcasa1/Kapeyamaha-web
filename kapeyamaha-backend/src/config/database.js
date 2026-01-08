const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kapeyamaha', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create admin user if doesn't exist
    await createAdminUser();
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    const User = require('../models/User');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kapeyamaha.com';
    
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
        phone: '+254758772539',
        isVerified: true,
        address: {
          street: 'Kitale-Lodwar Highway',
          city: 'Kapenguria',
          country: 'Kenya'
        }
      });
      
      console.log('✅ Admin user created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

module.exports = connectDB;