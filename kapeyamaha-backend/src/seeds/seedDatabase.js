const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Sample products data
const products = [
  {
    name: 'Toyota Land Cruiser 300',
    category: 'car',
    brand: 'Toyota',
    description: 'Flagship luxury SUV with 3.5L twin-turbo V6 engine, unmatched off-road capability and premium interior.',
    price: 125000,
    stock: 5,
    features: ['3.5L V6 Twin-Turbo', '4WD', 'Advanced Safety', 'Luxury Interior', 'Multi-Terrain Select'],
    specifications: {
      engine: '3.5L V6 Twin-Turbo',
      power: '409 HP',
      torque: '650 Nm',
      transmission: '10-Speed Automatic',
      fuel: 'Petrol/Hybrid'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563720223486-3294263566c6?auto=format&fit=crop&w=600',
        alt: 'Toyota Land Cruiser 300',
        isPrimary: true
      }
    ],
    isFeatured: true,
    tags: ['SUV', 'Luxury', '4WD']
  },
  {
    name: 'Toyota Hilux',
    category: 'car',
    brand: 'Toyota',
    description: 'Legendary pickup truck known for reliability, durability and versatility in all conditions.',
    price: 45000,
    stock: 10,
    features: ['2.8L Diesel', '4WD', 'Towing Package', 'Rugged Design', 'Advanced Safety'],
    specifications: {
      engine: '2.8L Turbo Diesel',
      power: '204 HP',
      torque: '500 Nm',
      transmission: '6-Speed Automatic',
      fuel: 'Diesel'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600',
        alt: 'Toyota Hilux',
        isPrimary: true
      }
    ],
    isFeatured: true,
    tags: ['Pickup', 'Utility', '4WD']
  },
  {
    name: 'Yamaha YZF-R1',
    category: 'motorbike',
    brand: 'Yamaha',
    description: 'Superbike with 998cc crossplane engine, advanced electronics, and aerodynamic design for track and street.',
    price: 15999,
    stock: 8,
    features: ['998cc Engine', '200 HP', 'Quick Shifter', 'LED Lighting', 'TFT Display'],
    specifications: {
      engine: '998cc Liquid-cooled',
      power: '200 HP',
      torque: '113 Nm',
      weight: '201 kg',
      fuelCapacity: '17L'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600',
        alt: 'Yamaha YZF-R1',
        isPrimary: true
      }
    ],
    isFeatured: true,
    tags: ['Sportbike', 'Superbike', 'Racing']
  },
  {
    name: 'Yamaha MT-07',
    category: 'motorbike',
    brand: 'Yamaha',
    description: 'Naked bike with 689cc twin-cylinder engine, perfect for city riding and weekend adventures.',
    price: 7999,
    stock: 12,
    features: ['689cc CP2 Engine', '75 HP', 'Lightweight Chassis', 'ABS', 'LED Headlight'],
    specifications: {
      engine: '689cc Liquid-cooled',
      power: '75 HP',
      torque: '68 Nm',
      weight: '184 kg',
      fuelCapacity: '14L'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519406709381-c1f293304b28?auto=format&fit=crop&w=600',
        alt: 'Yamaha MT-07',
        isPrimary: true
      }
    ],
    isFeatured: true,
    tags: ['Naked', 'Street', 'Commuter']
  },
  {
    name: 'Toyota Engine Oil Filter',
    category: 'spare-part',
    brand: 'Toyota',
    description: 'Original Toyota oil filter for optimal engine protection and performance.',
    price: 25,
    stock: 100,
    features: ['Genuine Toyota', 'High Filtration', 'Easy Installation', 'Long Life'],
    compatibility: ['All Toyota Models'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1620830959141-6eb8d8d4eac3?auto=format&fit=crop&w=600',
        alt: 'Toyota Oil Filter',
        isPrimary: true
      }
    ],
    tags: ['Engine', 'Filter', 'Maintenance']
  },
  {
    name: 'Toyota Brake Pads (Front)',
    category: 'spare-part',
    brand: 'Toyota',
    description: 'Original Toyota brake pads for reliable and consistent braking performance.',
    price: 75,
    stock: 50,
    features: ['OE Quality', 'Low Noise', 'Low Dust', 'Long Life'],
    compatibility: ['Toyota Sedans and SUVs'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600',
        alt: 'Toyota Brake Pads',
        isPrimary: true
      }
    ],
    tags: ['Brake', 'Safety', 'Wear Part']
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kapeyamaha';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    console.log('🧹 Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Products cleared');

    // Insert new products
    console.log('📦 Inserting products...');
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products inserted`);

    // Create admin user if not exists
    console.log('👤 Checking admin user...');
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
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Get total counts
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();

    console.log('\n📊 Seeding Summary:');
    console.log(`   Total Products: ${productCount}`);
    console.log(`   Total Users: ${userCount}`);
    console.log('\n✅ Database seeding completed successfully!');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();