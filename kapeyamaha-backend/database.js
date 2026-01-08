const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create admin user if not exists
    await createAdminUser();
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  const User = require('../models/User');
  const adminEmail = process.env.ADMIN_EMAIL;
  
  try {
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const adminUser = await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        phone: '+254758772539',
        address: {
          street: 'Kitale-Lodwar Highway',
          city: 'Kapenguria',
          country: 'Kenya'
        },
        isVerified: true
      });
      
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

module.exports = connectDB;