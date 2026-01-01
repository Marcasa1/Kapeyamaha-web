const mongoose = require('mongoose');
const Product = require('../models/Product');

// All products from your HTML
const allProducts = [
    {
        id: "bike-01",
        name: "Yamaha YZF-R1",
        category: "motorbike",
        price: 15999,
        description: "Superbike with 998cc crossplane engine, advanced electronics, and aerodynamic design for track and street.",
        features: ["998cc Engine", "200 HP", "Quick Shifter", "LED Lighting", "TFT Display"],
        image: "images/vehicles/yamaha-yzf-r1.jpg",
        specs: { engine: "998cc Liquid-cooled", power: "200 HP", torque: "113 Nm", weight: "201 kg", fuelCapacity: "17L" },
        brand: "Yamaha",
        stock: 5
    },
    {
        id: "bike-02",
        name: "Yamaha MT-07",
        category: "motorbike",
        price: 7999,
        description: "Naked bike with 689cc twin-cylinder engine, perfect for city riding and weekend adventures.",
        features: ["689cc CP2 Engine", "75 HP", "Lightweight Chassis", "ABS", "LED Headlight"],
        image: "images/vehicles/yamaha-mt-07.jpg",
        specs: { engine: "689cc Liquid-cooled", power: "75 HP", torque: "68 Nm", weight: "184 kg", fuelCapacity: "14L" },
        brand: "Yamaha",
        stock: 8
    },
    {
        id: "bike-03",
        name: "Yamaha XMAX 300",
        category: "motorbike",
        price: 5499,
        description: "Maxi-scooter with 292cc engine, ample storage, and premium features for urban commuting.",
        features: ["292cc Engine", "Smart Key System", "TCS", "Large Underseat Storage", "LED Lights"],
        image: "images/vehicles/yamaha-xmax-300.jpg",
        specs: { engine: "292cc Liquid-cooled", power: "28 HP", torque: "29 Nm", weight: "179 kg", fuelCapacity: "13L" },
        brand: "Yamaha",
        stock: 6
    },
    {
        id: "bike-04",
        name: "Yamaha Tenere",
        category: "motorbike",
        price: 10999,
        description: "Adventure bike with 689cc CP2 engine, long travel suspension, and rugged design for off-road exploration.",
        features: ["689cc CP2 Engine", "Rally Heritage", "Adventure Ready", "Spoke Wheels", "Adjustable Suspension"],
        image: "images/vehicles/yamaha-tenere.jpg",
        specs: { engine: "689cc Liquid-cooled", power: "73 HP", torque: "68 Nm", weight: "205 kg", fuelCapacity: "16L" },
        brand: "Yamaha",
        stock: 4
    },
    {
        id: "bike-05",
        name: "Yamaha YZF-R3",
        category: "motorbike",
        price: 5299,
        description: "Entry-level sportbike with 321cc twin-cylinder engine, perfect for new riders and track days.",
        features: ["321cc Twin", "Sport Handling", "ABS", "LED Lights", "Lightweight"],
        image: "images/vehicles/yamaha-yzf-r3.jpg",
        specs: { engine: "321cc Liquid-cooled", power: "42 HP", torque: "30 Nm", weight: "169 kg", fuelCapacity: "14L" },
        brand: "Yamaha",
        stock: 7
    },
    {
        id: "bike-06",
        name: "Yamaha MT-09",
        category: "motorbike",
        price: 9499,
        description: "Hyper Naked with 890cc triple-cylinder engine, aggressive styling, and advanced electronics.",
        features: ["890cc CP3 Engine", "Quick Shifter", "TCS", "LED Lighting", "Multiple Riding Modes"],
        image: "images/vehicles/yamaha-mt-09.jpg",
        specs: { engine: "890cc Liquid-cooled", power: "119 HP", torque: "93 Nm", weight: "193 kg", fuelCapacity: "14L" },
        brand: "Yamaha",
        stock: 5
    },
    {
        id: "car-01",
        name: "Toyota Land Cruiser 300",
        category: "car",
        price: 125000,
        description: "Flagship luxury SUV with 3.5L twin-turbo V6 engine, unmatched off-road capability and premium interior.",
        features: ["3.5L V6 Twin-Turbo", "4WD", "Advanced Safety", "Luxury Interior", "Multi-Terrain Select"],
        image: "images/vehicles/toyota-land-cruiser-300-2023.jpg",
        specs: { engine: "3.5L V6 Twin-Turbo", power: "409 HP", torque: "650 Nm", transmission: "10-Speed Automatic", fuel: "Petrol/Hybrid" },
        brand: "Toyota",
        stock: 3
    },
    {
        id: "car-02",
        name: "Toyota Hilux",
        category: "car",
        price: 45000,
        description: "Legendary pickup truck known for reliability, durability and versatility in all conditions.",
        features: ["2.8L Diesel", "4WD", "Towing Package", "Rugged Design", "Advanced Safety"],
        image: "images/vehicles/toyota-hilux.jpg",
        specs: { engine: "2.8L Turbo Diesel", power: "204 HP", torque: "500 Nm", transmission: "6-Speed Automatic", fuel: "Diesel" },
        brand: "Toyota",
        stock: 10
    },
    {
        id: "car-03",
        name: "Toyota RAV4",
        category: "car",
        price: 32000,
        description: "Compact SUV with hybrid option, spacious interior, and advanced safety features for family adventures.",
        features: ["Hybrid Available", "AWD", "Toyota Safety Sense", "Spacious Cabin", "Apple CarPlay/Android Auto"],
        image: "images/vehicles/toyota-rav4.jpg",
        specs: { engine: "2.5L Hybrid/2.5L Petrol", power: "219 HP (Hybrid)", torque: "221 Nm", transmission: "8-Speed CVT", fuel: "Petrol/Hybrid" },
        brand: "Toyota",
        stock: 6
    },
    {
        id: "car-04",
        name: "Toyota Corolla",
        category: "car",
        price: 23000,
        description: "World's best-selling sedan with hybrid efficiency, modern design, and comprehensive safety features.",
        features: ["Hybrid Efficiency", "Safety Sense", "Modern Design", "Comfortable Ride", "Good Fuel Economy"],
        image: "images/vehicles/toyota-corolla.jpg",
        specs: { engine: "2.0L Hybrid/1.8L Petrol", power: "169 HP", torque: "205 Nm", transmission: "CVT", fuel: "Petrol/Hybrid" },
        brand: "Toyota",
        stock: 8
    },
    {
        id: "car-05",
        name: "Toyota Landcruiser Prado",
        category: "car",
        price: 85000,
        description: "Premium mid-size SUV with excellent off-road capability and luxurious comfort for long journeys.",
        features: ["4.0L V6/2.8L Diesel", "Full-Time 4WD", "KDSS Suspension", "Premium Interior", "Multi-Terrain Monitor"],
        image: "images/vehicles/toyota-landcruiser-prado.jpg",
        specs: { engine: "4.0L V6/2.8L Diesel", power: "271 HP (V6)", torque: "381 Nm", transmission: "6-Speed Automatic", fuel: "Petrol/Diesel" },
        brand: "Toyota",
        stock: 4
    },
    {
        id: "car-06",
        name: "Toyota Fortuner",
        category: "car",
        price: 55000,
        description: "Rugged 7-seat SUV built on Hilux platform, offering durability, space and off-road capability.",
        features: ["2.8L Diesel", "4WD/2WD Options", "7-Seater", "Tough Build", "Advanced Infotainment"],
        image: "images/vehicles/toyota-fortuner.jpg",
        specs: { engine: "2.8L Turbo Diesel", power: "204 HP", torque: "500 Nm", transmission: "6-Speed Automatic", fuel: "Diesel" },
        brand: "Toyota",
        stock: 7
    },
    {
        id: "vehicle-01",
        name: "Toyota Hiace Van",
        category: "vehicle",
        price: 42000,
        description: "Versatile passenger and cargo van with spacious interior and reliable performance.",
        features: ["3.0L Diesel", "15-Seater", "Spacious Cabin", "Commercial Grade", "Durable Build"],
        image: "images/vehicles/toyota-hiace.jpg",
        specs: { engine: "3.0L Turbo Diesel", capacity: "15 Passengers", transmission: "6-Speed Manual/Automatic", fuel: "Diesel" },
        brand: "Toyota",
        stock: 5
    },
    {
        id: "vehicle-02",
        name: "Toyota Coaster Bus",
        category: "vehicle",
        price: 85000,
        description: "Premium bus for passenger transport with comfortable seating and advanced safety features.",
        features: ["4.2L Diesel", "30-Seater", "Air Conditioning", "Comfort Seats", "Safety Features"],
        image: "images/vehicles/toyota-coaster.jpg",
        specs: { engine: "4.2L Diesel", capacity: "30 Passengers", transmission: "6-Speed Automatic", fuel: "Diesel" },
        brand: "Toyota",
        stock: 3
    },
    {
        id: "vehicle-03",
        name: "HINO FC 500",
        category: "vehicle",
        price: 55000,
        description: "Medium-duty truck for cargo transport with excellent payload capacity and reliability.",
        features: ["4.0L Diesel", "5-Ton Capacity", "Power Steering", "Durable Chassis", "Easy Maintenance"],
        image: "images/vehicles/hino-fc-500.jpg",
        specs: { engine: "4.0L Diesel", capacity: "5 Tons", transmission: "5-Speed Manual", fuel: "Diesel" },
        brand: "Hino",
        stock: 4
    },
    {
        id: "vehicle-04",
        name: "Toyota Land Cruiser 79",
        category: "vehicle",
        price: 95000,
        description: "Heavy-duty utility vehicle built for tough conditions and off-road operations.",
        features: ["4.5L Diesel V8", "4WD", "Utility Vehicle", "Heavy Duty", "Off-Road Capable"],
        image: "images/vehicles/toyota-landcruiser-79.jpg",
        specs: { engine: "4.5L Diesel V8", capacity: "1 Ton", transmission: "5-Speed Manual", fuel: "Diesel" },
        brand: "Toyota",
        stock: 2
    },
    {
        id: "vehicle-05",
        name: "Toyota Hilux Double Cab",
        category: "vehicle",
        price: 48000,
        description: "Premium pickup with double cab for passenger comfort and cargo utility.",
        features: ["2.8L Diesel", "4WD", "Double Cab", "Leather Seats", "Advanced Infotainment"],
        image: "images/vehicles/toyota-hilux-doublecab.jpg",
        specs: { engine: "2.8L Turbo Diesel", capacity: "5 Passengers", transmission: "6-Speed Automatic", fuel: "Diesel" },
        brand: "Toyota",
        stock: 8
    },
    {
        id: "vehicle-06",
        name: "Toyota Highlander",
        category: "vehicle",
        price: 55000,
        description: "Compact utility vehicle perfect for luxury and cargo transport.",
        features: ["1.5L Petrol", "Compact Size", "Fuel Efficient", "Spacious Cargo", "Easy to Drive"],
        image: "images/vehicles/toyota-highlander.jpg",
        specs: { engine: "2.8L Petrol", capacity: "5 Passengers", transmission: "7-Speed Manual", fuel: "Petrol" },
        brand: "Toyota",
        stock: 6
    },
    {
        id: "part-engine-01",
        name: "Toyota Engine Oil Filter",
        category: "engine",
        price: 25,
        description: "Original Toyota oil filter for optimal engine protection and performance.",
        features: ["Genuine Toyota", "High Filtration", "Easy Installation", "Long Life"],
        image: "images/parts/toyota-oil-filter.jpg",
        compatibility: ["All Toyota Models"],
        brand: "Toyota",
        stock: 50
    },
    {
        id: "part-engine-02",
        name: "Yamaha Air Filter",
        category: "engine",
        price: 35,
        description: "Genuine Yamaha air filter for clean air intake and engine efficiency.",
        features: ["Genuine Yamaha", "High Airflow", "Washable", "Performance"],
        image: "images/parts/yamaha-air-filter.jpg",
        compatibility: ["All Yamaha Motorcycles"],
        brand: "Yamaha",
        stock: 40
    },
    {
        id: "part-engine-03",
        name: "Toyota Spark Plugs",
        category: "engine",
        price: 65,
        description: "Set of genuine Toyota spark plugs for optimal ignition performance.",
        features: ["Iridium Tips", "Better Combustion", "Fuel Efficient", "Long Lasting"],
        image: "images/parts/toyota-spark-plugs.jpg",
        compatibility: ["Toyota 4-Cylinder Engines"],
        brand: "Toyota",
        stock: 100
    },
    {
        id: "part-engine-04",
        name: "Toyota Timing Belt Kit",
        category: "engine",
        price: 180,
        description: "Complete timing belt kit with tensioner and idler pulleys.",
        features: ["Complete Kit", "OE Quality", "Includes Tensioner", "Reliable"],
        image: "images/parts/toyota-timing-belt.jpg",
        compatibility: ["Toyota Camry, Corolla, RAV4"],
        brand: "Toyota",
        stock: 25
    },
    {
        id: "part-brake-01",
        name: "Toyota Brake Pads (Front)",
        category: "brake",
        price: 75,
        description: "Original Toyota brake pads for reliable and consistent braking performance.",
        features: ["OE Quality", "Low Noise", "Low Dust", "Long Life"],
        image: "images/parts/toyota-brake-pads.jpg",
        compatibility: ["Toyota Sedans and SUVs"],
        brand: "Toyota",
        stock: 60
    },
    {
        id: "part-brake-02",
        name: "Yamaha Brake Pads",
        category: "brake",
        price: 45,
        description: "Original Yamaha brake pads for superior stopping power and durability.",
        features: ["Genuine Yamaha", "High Friction", "Quick Response", "Durable"],
        image: "images/parts/yamaha-brake-pads.jpg",
        compatibility: ["Yamaha Sport Bikes"],
        brand: "Yamaha",
        stock: 55
    },
    {
        id: "part-electrical-01",
        name: "Toyota Battery",
        category: "electrical",
        price: 150,
        description: "Maintenance-free battery designed specifically for Toyota vehicles.",
        features: ["Maintenance Free", "High CCA", "Long Life", "Warranty"],
        image: "images/parts/toyota-battery.jpg",
        compatibility: ["All Toyota Models"],
        brand: "Toyota",
        stock: 30
    },
    {
        id: "part-electrical-02",
        name: "Yamaha Battery",
        category: "electrical",
        price: 85,
        description: "Maintenance-free battery designed specifically for Yamaha motorcycles.",
        features: ["Maintenance Free", "High Performance", "Compact", "Reliable"],
        image: "images/parts/yamaha-battery.jpg",
        compatibility: ["Yamaha Motorcycles"],
        brand: "Yamaha",
        stock: 35
    },
    {
        id: "part-suspension-01",
        name: "Toyota Shock Absorbers (Front)",
        category: "suspension",
        price: 120,
        description: "Original Toyota shock absorbers for comfortable ride and handling.",
        features: ["Gas Charged", "OE Quality", "Comfort Ride", "Durable"],
        image: "images/parts/toyota-shock-absorbers.jpg",
        compatibility: ["Toyota Corolla, Camry"],
        brand: "Toyota",
        stock: 20
    },
    {
        id: "part-body-01",
        name: "Toyota Headlight Assembly",
        category: "body",
        price: 280,
        description: "Original Toyota headlight assembly with bulbs and housing.",
        features: ["Complete Assembly", "LED Available", "OE Quality", "Easy Installation"],
        image: "images/parts/toyota-headlight-assembly.jpg",
        compatibility: ["Toyota Specific Models"],
        brand: "Toyota",
        stock: 15
    },
    {
        id: "part-fluid-01",
        name: "Toyota Genuine Engine Oil 5W-30",
        category: "fluid",
        price: 55,
        description: "Premium Toyota engine oil for maximum engine protection.",
        features: ["Synthetic Blend", "5W-30", "4 Liters", "API Certified"],
        image: "images/parts/toyota-engine-oil.jpg",
        compatibility: ["All Toyota Models"],
        brand: "Toyota",
        stock: 80
    },
    {
        id: "part-accessory-01",
        name: "Yamaha Chain & Sprocket Kit",
        category: "accessory",
        price: 120,
        description: "Complete chain and sprocket kit for smooth power transmission.",
        features: ["Complete Kit", "O-Ring Chain", "Steel Sprockets", "Easy Installation"],
        image: "images/parts/yamaha-chain-sprocket-kit.jpg",
        compatibility: ["Yamaha 400-750cc Models"],
        brand: "Yamaha",
        stock: 25
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/kapeyamaha', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Connected to MongoDB');
        
        // Clear existing products
        await mongoose.connection.dropDatabase();
        console.log('🗑️  Cleared existing database');
        
        // Insert all products
        console.log('📦 Inserting products...');
        await Product.insertMany(allProducts);
        
        console.log(`✅ Successfully seeded ${allProducts.length} products!`);
        
        // Display summary
        const categories = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        console.log('\n📊 Product Summary by Category:');
        categories.forEach(cat => {
            console.log(`   ${cat._id}: ${cat.count} products`);
        });
        
        const totalValue = allProducts.reduce((sum, product) => sum + product.price, 0);
        console.log(`💰 Total inventory value: $${totalValue.toLocaleString()}`);
        
        console.log('\n🎉 Database seeding completed!');
        console.log('🚀 Start your server with: npm run dev');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        console.error('💡 Make sure MongoDB is running: mongod');
        process.exit(1);
    }
}

// Run seeding
seedDatabase();