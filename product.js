// Products data - Keeping your original images from HTML
const yamahaBikes = [
    {
        id: "bike-01",
        name: "Yamaha YZF-R1",
        category: "motorbike",
        price: 15999,
        description: "Superbike with 998cc crossplane engine, advanced electronics, and aerodynamic design for track and street.",
        features: ["998cc Engine", "200 HP", "Quick Shifter", "LED Lighting", "TFT Display"],
        image: "yamaha-yzf-r166ec165a9cf4d.avif",
        specs: { engine: "998cc Liquid-cooled", power: "200 HP", torque: "113 Nm", weight: "201 kg", fuelCapacity: "17L" }
    },
    {
        id: "bike-02",
        name: "Yamaha MT-07",
        category: "motorbike",
        price: 7999,
        description: "Naked bike with 689cc twin-cylinder engine, perfect for city riding and weekend adventures.",
        features: ["689cc CP2 Engine", "75 HP", "Lightweight Chassis", "ABS", "LED Headlight"],
        image: "yamaha-mt-07-2021-review-price-spec_02.avif",
        specs: { engine: "689cc Liquid-cooled", power: "75 HP", torque: "68 Nm", weight: "184 kg", fuelCapacity: "14L" }
    },
    {
        id: "bike-03",
        name: "Yamaha XMAX 300",
        category: "motorbike",
        price: 5499,
        description: "Maxi-scooter with 292cc engine, ample storage, and premium features for urban commuting.",
        features: ["292cc Engine", "Smart Key System", "TCS", "Large Underseat Storage", "LED Lights"],
        image: "XMAX 300.png",
        specs: { engine: "292cc Liquid-cooled", power: "28 HP", torque: "29 Nm", weight: "179 kg", fuelCapacity: "13L" }
    },
    {
        id: "bike-04",
        name: "yamaha Tenere",
        category: "motorbike",
        price: 10999,
        description: "Adventure bike with 689cc CP2 engine, long travel suspension, and rugged design for off-road exploration.",
        features: ["689cc CP2 Engine", "Rally Heritage", "Adventure Ready", "Spoke Wheels", "Adjustable Suspension"],
        image: "yamaha tenere.jpg",
        specs: { engine: "689cc Liquid-cooled", power: "73 HP", torque: "68 Nm", weight: "205 kg", fuelCapacity: "16L" }
    },
    {
        id: "bike-05",
        name: "Yamaha YZF-R3",
        category: "motorbike",
        price: 5299,
        description: "Entry-level sportbike with 321cc twin-cylinder engine, perfect for new riders and track days.",
        features: ["321cc Twin", "Sport Handling", "ABS", "LED Lights", "Lightweight"],
        image: "YZF-R3-Blue.avif",
        specs: { engine: "321cc Liquid-cooled", power: "42 HP", torque: "30 Nm", weight: "169 kg", fuelCapacity: "14L" }
    },
    {
        id: "bike-06",
        name: "Yamaha MT-09",
        category: "motorbike",
        price: 9499,
        description: "Hyper Naked with 890cc triple-cylinder engine, aggressive styling, and advanced electronics.",
        features: ["890cc CP3 Engine", "Quick Shifter", "TCS", "LED Lighting", "Multiple Riding Modes"],
        image: "MT O9.jpg",
        specs: { engine: "890cc Liquid-cooled", power: "119 HP", torque: "93 Nm", weight: "193 kg", fuelCapacity: "14L" }
    }
];

const toyotaCars = [
    {
        id: "car-01",
        name: "Toyota Land Cruiser 300",
        category: "car",
        price: 125000,
        description: "Flagship luxury SUV with 3.5L twin-turbo V6 engine, unmatched off-road capability and premium interior.",
        features: ["3.5L V6 Twin-Turbo", "4WD", "Advanced Safety", "Luxury Interior", "Multi-Terrain Select"],
        image: "LANDCRUISER 300.png",
        specs: { engine: "3.5L V6 Twin-Turbo", power: "409 HP", torque: "650 Nm", transmission: "10-Speed Automatic", fuel: "Petrol/Hybrid" }
    },
    {
        id: "car-02",
        name: "Toyota Hilux",
        category: "car",
        price: 45000,
        description: "Legendary pickup truck known for reliability, durability and versatility in all conditions.",
        features: ["2.8L Diesel", "4WD", "Towing Package", "Rugged Design", "Advanced Safety"],
        image: "Toyota-Hilux-2021-new.jpg",
        specs: { engine: "2.8L Turbo Diesel", power: "204 HP", torque: "500 Nm", transmission: "6-Speed Automatic", fuel: "Diesel" }
    },
    {
        id: "car-03",
        name: "Toyota RAV4",
        category: "car",
        price: 32000,
        description: "Compact SUV with hybrid option, spacious interior, and advanced safety features for family adventures.",
        features: ["Hybrid Available", "AWD", "Toyota Safety Sense", "Spacious Cabin", "Apple CarPlay/Android Auto"],
        image: "RAV-4 HYBRID.avif",
        specs: { engine: "2.5L Hybrid/2.5L Petrol", power: "219 HP (Hybrid)", torque: "221 Nm", transmission: "8-Speed CVT", fuel: "Petrol/Hybrid" }
    },
    {
        id: "car-04",
        name: "Toyota Corolla",
        category: "car",
        price: 23000,
        description: "World's best-selling sedan with hybrid efficiency, modern design, and comprehensive safety features.",
        features: ["Hybrid Efficiency", "Safety Sense", "Modern Design", "Comfortable Ride", "Good Fuel Economy"],
        image: "TOYOTA COROLLA.png",
        specs: { engine: "2.0L Hybrid/1.8L Petrol", power: "169 HP", torque: "205 Nm", transmission: "CVT", fuel: "Petrol/Hybrid" }
    },
    {
        id: "car-05",
        name: "Toyota Landcruiser Prado",
        category: "car",
        price: 85000,
        description: "Premium mid-size SUV with excellent off-road capability and luxurious comfort for long journeys.",
        features: ["4.0L V6/2.8L Diesel", "Full-Time 4WD", "KDSS Suspension", "Premium Interior", "Multi-Terrain Monitor"],
        image: "LANDCRUISER PRADO.png",
        specs: { engine: "4.0L V6/2.8L Diesel", power: "271 HP (V6)", torque: "381 Nm", transmission: "6-Speed Automatic", fuel: "Petrol/Diesel" }
    },
    {
        id: "car-06",
        name: "Toyota Fortuner",
        category: "car",
        price: 55000,
        description: "Rugged 7-seat SUV built on Hilux platform, offering durability, space and off-road capability.",
        features: ["2.8L Diesel", "4WD/2WD Options", "7-Seater", "Tough Build", "Advanced Infotainment"],
        image: "Fortuner-Auto.jpg",
        specs: { engine: "2.8L Turbo Diesel", power: "204 HP", torque: "500 Nm", transmission: "6-Speed Automatic", fuel: "Diesel" }
    }
];

const commercialVehicles = [
    {
        id: "vehicle-01",
        name: "Toyota Hiace Van",
        category: "vehicle",
        price: 42000,
        description: "Versatile passenger and cargo van with spacious interior and reliable performance.",
        features: ["3.0L Diesel", "15-Seater", "Spacious Cabin", "Commercial Grade", "Durable Build"],
        image: "hiace.jpg",
        specs: { engine: "3.0L Turbo Diesel", capacity: "15 Passengers", transmission: "6-Speed Manual/Automatic", fuel: "Diesel", warranty: "3 Years/100,000 km" }
    },
    {
        id: "vehicle-02",
        name: "Toyota Coaster Bus",
        category: "vehicle",
        price: 85000,
        description: "Premium bus for passenger transport with comfortable seating and advanced safety features.",
        features: ["4.2L Diesel", "30-Seater", "Air Conditioning", "Comfort Seats", "Safety Features"],
        image: "COASTER.webp",
        specs: { engine: "4.2L Diesel", capacity: "30 Passengers", transmission: "6-Speed Automatic", fuel: "Diesel", warranty: "3 Years/150,000 km" }
    },
    {
        id: "vehicle-03",
        name: "HINO FC 500",
        category: "vehicle",
        price: 55000,
        description: "Medium-duty truck for cargo transport with excellent payload capacity and reliability.",
        features: ["4.0L Diesel", "5-Ton Capacity", "Power Steering", "Durable Chassis", "Easy Maintenance"],
        image: "HINO.png",
        specs: { engine: "4.0L Diesel", capacity: "5 Tons", transmission: "5-Speed Manual", fuel: "Diesel", warranty: "2 Years/100,000 km" }
    },
    {
        id: "vehicle-04",
        name: "Toyota Land Cruiser 79",
        category: "vehicle",
        price: 95000,
        description: "Heavy-duty utility vehicle built for tough conditions and off-road operations.",
        features: ["4.5L Diesel V8", "4WD", "Utility Vehicle", "Heavy Duty", "Off-Road Capable"],
        image: "LANDCRIUSER 79.png",
        specs: { engine: "4.5L Diesel V8", capacity: "Heavy Duty", transmission: "5-Speed Manual", fuel: "Diesel", warranty: "2 Years/100,000 km" }
    },
    {
        id: "vehicle-05",
        name: "Toyota Hilux Double Cab",
        category: "vehicle",
        price: 48000,
        description: "Premium pickup with double cab for passenger comfort and cargo utility.",
        features: ["2.8L Diesel", "4WD", "Double Cab", "Leather Seats", "Advanced Infotainment"],
        image: "hilux double-cabin.png",
        specs: { engine: "2.8L Turbo Diesel", capacity: "5 Passengers", transmission: "6-Speed Automatic", fuel: "Diesel", warranty: "3 Years/100,000 km" }
    },
    {
        id: "vehicle-06",
        name: "Toyota Highlander",
        category: "vehicle",
        price: 55000,
        description: "Compact utility vehicle perfect for luxury and cargo transport.",
        features: ["1.5L Petrol", "Compact Size", "Fuel Efficient", "Spacious Cargo", "Easy to Drive"],
        image: "suvs3.avif",
        specs: { engine: "2.8 L Petrol", capacity: "5 Passengers", transmission: "7-Speed Manual", fuel: "Petrol", warranty: "2 Years/150,000 km" }
    }
];

const spareParts = [
    {
        id: "part-engine-01",
        name: "Toyota Engine Oil Filter",
        category: "engine",
        subcategory: "filter",
        price: 25,
        description: "Original Toyota oil filter for optimal engine protection and performance.",
        features: ["Genuine Toyota", "High Filtration", "Easy Installation", "Long Life"],
        image: "oil filter.png",
        compatibility: ["All Toyota Models"]
    },
    {
        id: "part-engine-02",
        name: "Yamaha Air Filter",
        category: "engine",
        subcategory: "filter",
        price: 35,
        description: "Genuine Yamaha air filter for clean air intake and engine efficiency.",
        features: ["Genuine Yamaha", "High Airflow", "Washable", "Performance"],
        image: "yamaha air filter.webp",
        compatibility: ["All Yamaha Motorcycles"]
    },
    {
        id: "part-engine-03",
        name: "Toyota Spark Plugs ",
        category: "engine",
        subcategory: "ignition",
        price: 65,
        description: "Set of genuine Toyota spark plugs for optimal ignition performance.",
        features: ["Iridium Tips", "Better Combustion", "Fuel Efficient", "Long Lasting"],
        image: "spark plug.webp",
        compatibility: ["Toyota 4-Cylinder Engines"]
    },
    {
        id: "part-engine-04",
        name: "Toyota Timing Belt Kit",
        category: "engine",
        subcategory: "belt",
        price: 180,
        description: "Complete timing belt kit with tensioner and idler pulleys.",
        features: ["Complete Kit", "OE Quality", "Includes Tensioner", "Reliable"],
        image: "timing belt.jpg",
        compatibility: ["Toyota Camry, Corolla, RAV4"]
    },
    {
        id: "part-brake-01",
        name: "Toyota Brake Pads (Front)",
        category: "brake",
        subcategory: "pads",
        price: 75,
        description: "Original Toyota brake pads for reliable and consistent braking performance.",
        features: ["OE Quality", "Low Noise", "Low Dust", "Long Life"],
        image: "WhatsApp Image 2025-11-02 at 21.57.47.jpeg",
        compatibility: ["Toyota Sedans and SUVs"]
    },
    {
        id: "part-brake-02",
        name: "Yamaha Brake Pads",
        category: "brake",
        subcategory: "pads",
        price: 45,
        description: "Original Yamaha brake pads for superior stopping power and durability.",
        features: ["Genuine Yamaha", "High Friction", "Quick Response", "Durable"],
        image: "https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        compatibility: ["Yamaha Sport Bikes"]
    },
    {
        id: "part-electrical-01",
        name: "Toyota Battery",
        category: "electrical",
        subcategory: "battery",
        price: 150,
        description: "Maintenance-free battery designed specifically for Toyota vehicles.",
        features: ["Maintenance Free", "High CCA", "Long Life", "Warranty"],
        image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        compatibility: ["All Toyota Models"]
    },
    {
        id: "part-electrical-02",
        name: "Yamaha Battery",
        category: "electrical",
        subcategory: "battery",
        price: 85,
        description: "Maintenance-free battery designed specifically for Yamaha motorcycles.",
        features: ["Maintenance Free", "High Performance", "Compact", "Reliable"],
        image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        compatibility: ["Yamaha Motorcycles"]
    },
    {
        id: "part-suspension-01",
        name: "Toyota Shock Absorbers (Front)",
        category: "suspension",
        subcategory: "shocks",
        price: 120,
        description: "Original Toyota shock absorbers for comfortable ride and handling.",
        features: ["Gas Charged", "OE Quality", "Comfort Ride", "Durable"],
        image: "https://images.unsplash.com/photo-1595521568221-3177c42bfd7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        compatibility: ["Toyota Corolla, Camry"]
    },
    {
        id: "part-body-01",
        name: "Toyota Headlight Assembly",
        category: "body",
        subcategory: "lights",
        price: 280,
        description: "Original Toyota headlight assembly with bulbs and housing.",
        features: ["Complete Assembly", "LED Available", "OE Quality", "Easy Installation"],
        image: "https://images.unsplash.com/photo-1595521568221-3177c42bfd7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        compatibility: ["Toyota Specific Models"]
    },
    {
        id: "part-fluid-01",
        name: "Toyota Genuine Engine Oil 5W-30",
        category: "fluid",
        subcategory: "oil",
        price: 55,
        description: "Premium Toyota engine oil for maximum engine protection.",
        features: ["Synthetic Blend", "5W-30", "4 Liters", "API Certified"],
        image: "https://images.unsplash.com/photo-1595521568221-3177c42bfd7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        compatibility: ["All Toyota Models"]
    },
    {
        id: "part-accessory-01",
        name: "Yamaha Chain & Sprocket Kit",
        category: "accessory",
        subcategory: "drive",
        price: 120,
        description: "Complete chain and sprocket kit for smooth power transmission.",
        features: ["Complete Kit", "O-Ring Chain", "Steel Sprockets", "Easy Installation"],
        image: "https://images.unsplash.com/photo-1595521568221-3177c42bfd7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        compatibility: ["Yamaha 400-750cc Models"]
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('kapeyamaha-cart')) || [];

// Display functions
function displayYamahaBikes(limit = 6) {
    const container = document.getElementById('bikes-container');
    if (!container) return;
    
    container.innerHTML = '';
    const bikesToShow = limit === 'all' ? yamahaBikes : yamahaBikes.slice(0, limit);
    
    bikesToShow.forEach(bike => {
        const bikeCard = createProductCard(bike);
        container.appendChild(bikeCard);
    });
}

function displayToyotaCars(limit = 6) {
    const container = document.getElementById('cars-container');
    if (!container) return;
    
    container.innerHTML = '';
    const carsToShow = limit === 'all' ? toyotaCars : toyotaCars.slice(0, limit);
    
    carsToShow.forEach(car => {
        const carCard = createProductCard(car);
        container.appendChild(carCard);
    });
}

function displayCommercialVehicles(limit = 6) {
    const container = document.getElementById('vehicles-container');
    if (!container) return;
    
    container.innerHTML = '';
    const vehiclesToShow = limit === 'all' ? commercialVehicles : commercialVehicles.slice(0, limit);
    
    vehiclesToShow.forEach(vehicle => {
        const vehicleCard = createProductCard(vehicle);
        container.appendChild(vehicleCard);
    });
}

function displaySpareParts(limit = 12, category = 'all') {
    const container = document.getElementById('parts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    let partsToShow = category === 'all' ? spareParts : spareParts.filter(part => part.category === category);
    partsToShow = limit === 'all' ? partsToShow : partsToShow.slice(0, limit);
    
    partsToShow.forEach(part => {
        const partCard = createProductCard(part);
        container.appendChild(partCard);
    });
}

function displayFeaturedParts() {
    const container = document.getElementById('featured-parts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const featuredParts = [
        ...spareParts.filter(p => p.category === 'engine').slice(0, 1),
        ...spareParts.filter(p => p.category === 'brake').slice(0, 1),
        ...spareParts.filter(p => p.category === 'electrical').slice(0, 1),
        ...spareParts.filter(p => p.category === 'accessory').slice(0, 1)
    ];
    
    featuredParts.forEach(part => {
        const partCard = createProductCard(part);
        container.appendChild(partCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 product-card';
    card.setAttribute('data-id', product.id);
    card.setAttribute('data-category', product.category);
    
    let badgeText = '';
    let badgeColor = 'bg-red-600';
    
    if (product.category === 'motorbike') {
        badgeText = 'Yamaha';
        badgeColor = 'bg-blue-600';
    } else if (product.category === 'car') {
        badgeText = 'Toyota';
        badgeColor = 'bg-red-600';
    } else if (product.category === 'vehicle') {
        badgeText = 'Commercial';
        badgeColor = 'bg-green-600';
    } else if (product.category === 'engine') {
        badgeText = 'Engine';
        badgeColor = 'bg-orange-600';
    } else if (product.category === 'brake') {
        badgeText = 'Brake';
        badgeColor = 'bg-purple-600';
    } else if (product.category === 'electrical') {
        badgeText = 'Electrical';
        badgeColor = 'bg-yellow-600';
    } else if (product.category === 'suspension') {
        badgeText = 'Suspension';
        badgeColor = 'bg-indigo-600';
    } else if (product.category === 'body') {
        badgeText = 'Body';
        badgeColor = 'bg-pink-600';
    } else if (product.category === 'fluid') {
        badgeText = 'Fluid';
        badgeColor = 'bg-teal-600';
    } else if (product.category === 'accessory') {
        badgeText = 'Accessory';
        badgeColor = 'bg-gray-600';
    } else {
        badgeText = 'Part';
        badgeColor = 'bg-gray-600';
    }
    
    card.innerHTML = `
        <div class="relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/600x400/333/fff?text=${encodeURIComponent(product.name)}';">
            <div class="absolute top-2 right-2 ${badgeColor} text-white px-2 py-1 rounded text-sm">
                ${badgeText}
            </div>
        </div>
        <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-2">${product.name}</h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
            
            ${product.features ? `
            <div class="mb-3">
                <h4 class="text-sm font-semibold text-gray-700 mb-1">Key Features:</h4>
                <div class="flex flex-wrap gap-1">
                    ${product.features.slice(0, 3).map(feature => 
                        `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${feature}</span>`
                    ).join('')}
                </div>
            </div>
            ` : ''}
            
            ${product.compatibility ? `
            <div class="mb-3">
                <h4 class="text-sm font-semibold text-gray-700 mb-1">Compatible With:</h4>
                <p class="text-xs text-gray-500">${Array.isArray(product.compatibility) ? product.compatibility.join(', ') : product.compatibility}</p>
            </div>
            ` : ''}
            
            <div class="flex justify-between items-center">
                <div>
                    <span class="text-2xl font-bold text-red-600">$${product.price.toLocaleString()}</span>
                    ${product.category === 'car' || product.category === 'vehicle' ? '<span class="text-sm text-gray-500 block">Starting Price</span>' : ''}
                </div>
                <div class="space-x-2">
                    <button class="view-details-btn bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm transition duration-300"
                            data-id="${product.id}">
                        Details
                    </button>
                    <button class="add-to-cart-btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition duration-300"
                            data-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function showProductDetails(productId) {
    let product;
    
    if (productId.startsWith('bike-')) {
        product = yamahaBikes.find(b => b.id === productId);
    } else if (productId.startsWith('car-')) {
        product = toyotaCars.find(c => c.id === productId);
    } else if (productId.startsWith('vehicle-')) {
        product = commercialVehicles.find(v => v.id === productId);
    } else if (productId.startsWith('part-')) {
        product = spareParts.find(p => p.id === productId);
    }
    
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg">
                <div class="mt-4 grid grid-cols-2 gap-2">
                    ${product.features ? product.features.map(feature => 
                        `<div class="bg-gray-50 p-2 rounded text-center">
                            <span class="text-sm text-gray-700">${feature}</span>
                        </div>`
                    ).join('') : ''}
                </div>
            </div>
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">${product.name}</h2>
                <div class="text-3xl font-bold text-red-600 mb-4">$${product.price.toLocaleString()}</div>
                <p class="text-gray-600 mb-4">${product.description}</p>
                
                ${product.specs ? `
                <div class="mb-4">
                    <h3 class="text-lg font-semibold mb-2">Specifications:</h3>
                    <div class="bg-gray-50 p-4 rounded">
                        ${Object.entries(product.specs).map(([key, value]) => `
                            <div class="flex justify-between py-1 border-b border-gray-200 last:border-0">
                                <span class="font-medium">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                <span class="text-gray-700">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${product.compatibility ? `
                <div class="mb-4">
                    <h3 class="text-lg font-semibold mb-2">Compatibility:</h3>
                    <div class="bg-gray-50 p-3 rounded">
                        <p class="text-gray-700">${Array.isArray(product.compatibility) ? product.compatibility.join(', ') : product.compatibility}</p>
                    </div>
                </div>
                ` : ''}
                
                <div class="flex space-x-4">
                    <button class="add-to-cart-detail-btn flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition duration-300"
                            data-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="buy-now-btn flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded transition duration-300"
                            data-id="${product.id}">
                        Buy Now
                    </button>
                    ${(product.category === 'motorbike' || product.category === 'car' || product.category === 'vehicle') ? `
                    <button class="book-service-from-product flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300"
                            data-id="${product.id}">
                        Book Service
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    const addToCartBtn = content.querySelector('.add-to-cart-detail-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(product.id);
            showNotification(`Added ${product.name} to cart!`);
        });
    }
    
    const buyNowBtn = content.querySelector('.buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            addToCart(product.id);
            document.getElementById('product-modal').style.display = 'none';
            document.getElementById('cart-preview').style.display = 'none';
            document.getElementById('checkout-modal').style.display = 'flex';
            updateCheckoutSummary();
        });
    }
    
    const bookServiceBtn = content.querySelector('.book-service-from-product');
    if (bookServiceBtn) {
        bookServiceBtn.addEventListener('click', () => {
            document.getElementById('product-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            
            const vehicleTypeSelect = document.getElementById('booking-vehicle-type');
            if (product.category === 'car') {
                vehicleTypeSelect.value = 'toyota-car';
            } else if (product.category === 'motorbike') {
                vehicleTypeSelect.value = 'yamaha-bike';
            } else if (product.category === 'vehicle') {
                vehicleTypeSelect.value = 'commercial';
            }
            
            vehicleTypeSelect.dispatchEvent(new Event('change'));
            document.getElementById('booking-vehicle-model').value = product.name;
            
            showNotification(`Ready to book service for your ${product.name}. Please select appointment date and time.`, 'success');
        });
    }
}

// Cart Functions
function addToCart(productId) {
    let product;
    
    if (productId.startsWith('bike-')) {
        product = yamahaBikes.find(b => b.id === productId);
    } else if (productId.startsWith('car-')) {
        product = toyotaCars.find(c => c.id === productId);
    } else if (productId.startsWith('vehicle-')) {
        product = commercialVehicles.find(v => v.id === productId);
    } else if (productId.startsWith('part-')) {
        product = spareParts.find(p => p.id === productId);
    }
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            category: product.category,
            image: product.image
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`Added ${product.name} to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartPreview();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function updateCartPreview() {
    const container = document.getElementById('cart-items');
    const itemsCount = document.getElementById('cart-items-count');
    const total = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Your cart is empty</p>';
        itemsCount.textContent = '0';
        total.textContent = '$0.00';
        return;
    }
    
    container.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center justify-between py-3 border-b';
        cartItem.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                <div class="ml-3">
                    <h4 class="font-medium text-sm">${item.name}</h4>
                    <p class="text-red-600 font-bold">$${item.price.toLocaleString()} × ${item.quantity}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button class="remove-item text-gray-500 hover:text-red-600" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(cartItem);
    });
    
    itemsCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    total.textContent = `$${totalPrice.toLocaleString()}`;
    
    container.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}

function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');
    
    let subtotal = 0;
    checkoutItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between py-2 border-b';
        itemEl.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>$${itemTotal.toLocaleString()}</span>
        `;
        checkoutItems.appendChild(itemEl);
    });
    
    const shipping = 50.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    shippingEl.textContent = `$${shipping.toLocaleString()}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('kapeyamaha-cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('kapeyamaha-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Export functions for use in script.js
window.products = {
    displayYamahaBikes,
    displayToyotaCars,
    displayCommercialVehicles,
    displaySpareParts,
    displayFeaturedParts,
    showProductDetails,
    addToCart,
    removeFromCart,
    updateCartCount,
    updateCartPreview,
    updateCheckoutSummary,
    saveCart,
    loadCart,
    showNotification,
    cart
};