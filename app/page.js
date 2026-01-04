// page.js - Client-side router for KAPEYAMAHA LIMITED
// This creates a single-page application with smooth navigation

// Initialize Page.js router
page.base('/');

// DOM elements
const appContent = document.getElementById('app-content');
const notification = document.getElementById('notification');

// State
let currentRoute = '/';

// Helper Functions
function updateNavigation(route) {
    // Update active state in desktop navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === route) {
            link.classList.add('active-nav');
        }
    });

    // Update active state in mobile navigation
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === route) {
            link.classList.add('active-nav');
        }
    });

    // Update page title
    const pageTitles = {
        '/': 'KAPEYAMAHA LIMITED - Toyota Cars, Vehicles & Spare Parts',
        '/cars': 'Toyota Cars - KAPEYAMAHA LIMITED',
        '/bikes': 'Yamaha Bikes - KAPEYAMAHA LIMITED',
        '/vehicles': 'Commercial Vehicles - KAPEYAMAHA LIMITED',
        '/parts': 'Spare Parts - KAPEYAMAHA LIMITED',
        '/faq': 'FAQ - KAPEYAMAHA LIMITED',
        '/contact': 'Contact - KAPEYAMAHA LIMITED'
    };
    
    document.title = pageTitles[route] || 'KAPEYAMAHA LIMITED';
}

function showLoading() {
    appContent.innerHTML = `
        <div class="text-center py-20 fade-in">
            <div class="spinner"></div>
            <p class="mt-4 text-gray-600">Loading content...</p>
        </div>
    `;
}

function render(content) {
    appContent.innerHTML = `<div class="fade-in">${content}</div>`;
}

function showNotification(message, type = 'success') {
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Product Card Template
function createProductCard(product) {
    const badgeColors = {
        motorbike: 'bg-blue-600',
        car: 'bg-red-600',
        vehicle: 'bg-green-600',
        engine: 'bg-orange-600',
        brake: 'bg-purple-600',
        electrical: 'bg-yellow-600',
        suspension: 'bg-indigo-600',
        body: 'bg-pink-600',
        fluid: 'bg-teal-600',
        accessory: 'bg-gray-600'
    };

    const badgeTexts = {
        motorbike: 'Yamaha',
        car: 'Toyota',
        vehicle: 'Commercial',
        engine: 'Engine',
        brake: 'Brake',
        electrical: 'Electrical',
        suspension: 'Suspension',
        body: 'Body',
        fluid: 'Fluid',
        accessory: 'Accessory'
    };

    const badgeColor = badgeColors[product.category] || 'bg-gray-600';
    const badgeText = badgeTexts[product.category] || 'Part';

    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 product-card" data-id="${product.id}">
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/600x400/333/fff?text=Product+Image'">
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
                
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-2xl font-bold text-red-600">$${product.price.toLocaleString()}</span>
                    </div>
                    <div class="space-x-2">
                        <button class="view-details-btn bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm transition duration-300" data-id="${product.id}">
                            Details
                        </button>
                        <button class="add-to-cart-btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition duration-300" data-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Page Templates
const homePage = () => `
    <!-- Hero Section -->
    <section class="hero-bg text-white py-20 md:py-32">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6">Your Complete Automotive Solution</h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Premium Toyota Cars, Yamaha Motorbikes, Commercial Vehicles & Genuine Spare Parts
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/cars" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                    Browse Toyota Cars
                </a>
                <a href="/parts" class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                    Shop Spare Parts
                </a>
            </div>
        </div>
    </section>

    <!-- Quick Categories -->
    <section class="bg-white py-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <a href="/cars" class="category-card bg-red-50 p-6 rounded-lg text-center hover:shadow-lg transition duration-300">
                    <div class="text-red-600 text-4xl mb-4">
                        <i class="fas fa-car"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Toyota Cars</h3>
                    <p class="text-gray-600 text-sm mt-2">Sedans, SUVs, Pickups</p>
                </a>
                
                <a href="/bikes" class="category-card bg-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition duration-300">
                    <div class="text-blue-600 text-4xl mb-4">
                        <i class="fas fa-motorcycle"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Yamaha Bikes</h3>
                    <p class="text-gray-600 text-sm mt-2">Sport, Cruiser, Scooters</p>
                </a>
                
                <a href="/vehicles" class="category-card bg-green-50 p-6 rounded-lg text-center hover:shadow-lg transition duration-300">
                    <div class="text-green-600 text-4xl mb-4">
                        <i class="fas fa-truck"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Commercial Vehicles</h3>
                    <p class="text-gray-600 text-sm mt-2">Vans, Trucks, Buses</p>
                </a>
                
                <a href="/parts" class="category-card bg-yellow-50 p-6 rounded-lg text-center hover:shadow-lg transition duration-300">
                    <div class="text-yellow-600 text-4xl mb-4">
                        <i class="fas fa-cogs"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Spare Parts</h3>
                    <p class="text-gray-600 text-sm mt-2">Toyota & Yamaha Parts</p>
                </a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-50 py-16">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">Why Choose KAPEYAMAHA?</h2>
                <div class="w-24 h-1 bg-red-600 mx-auto"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center">
                    <div class="text-red-600 text-4xl mb-4">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-gray-800">Genuine Products</h3>
                    <p class="text-gray-600">All vehicles and parts are 100% genuine with complete documentation and warranty.</p>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center">
                    <div class="text-red-600 text-4xl mb-4">
                        <i class="fas fa-tools"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-gray-800">Expert Service</h3>
                    <p class="text-gray-600">Certified technicians for Toyota and Yamaha vehicles with state-of-the-art workshops.</p>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center">
                    <div class="text-red-600 text-4xl mb-4">
                        <i class="fas fa-hand-holding-usd"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-gray-800">Flexible Financing</h3>
                    <p class="text-gray-600">Competitive prices with flexible financing options and trade-in facilities.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
                <div class="w-24 h-1 bg-red-600 mx-auto"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-sm testimonial-card">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Customer" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">NANCY C.</h4>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600">
                        "Bought my Toyota Hilux from KAPEYAMAHA and couldn't be happier. Their after-sales service is exceptional!"
                    </p>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-sm testimonial-card">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                            <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Customer" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">ALFRED O</h4>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600">
                        "Found all the genuine parts I needed for my Yamaha. Staff was very knowledgeable and helpful."
                    </p>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-sm testimonial-card">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Customer" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">ALBERT W.</h4>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600">
                        "Excellent selection of Toyota cars and commercial vehicles. Our business fleet has been running perfectly."
                    </p>
                </div>
            </div>
        </div>
    </section>
`;

const carsPage = () => {
    const cars = window.productData?.toyotaCars || [];
    return `
        <!-- Toyota Cars Section -->
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Toyota Car Collection</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Reliability, performance, and luxury in our curated Toyota collection</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="cars-container">
                    ${cars.map(car => createProductCard(car)).join('')}
                </div>
            </div>
        </section>
    `;
};

const bikesPage = () => {
    const bikes = window.productData?.yamahaBikes || [];
    return `
        <!-- Yamaha Motorbikes Section -->
        <section class="py-16 bg-gray-50">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Yamaha Motorbike Collection</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Discover our range of high-performance Yamaha motorcycles for every rider</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="bikes-container">
                    ${bikes.map(bike => createProductCard(bike)).join('')}
                </div>
            </div>
        </section>
    `;
};

const vehiclesPage = () => {
    const vehicles = window.productData?.commercialVehicles || [];
    return `
        <!-- Commercial Vehicles Section -->
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Commercial & Utility Vehicles</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Reliable commercial vehicles for business and utility purposes</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="vehicles-container">
                    ${vehicles.map(vehicle => createProductCard(vehicle)).join('')}
                </div>
            </div>
        </section>
    `;
};

const partsPage = () => {
    const parts = window.productData?.spareParts || [];
    return `
        <!-- Spare Parts Section -->
        <section class="py-16 bg-gray-50">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Genuine Spare Parts</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Original Toyota & Yamaha spare parts for optimal performance and longevity</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="parts-container">
                    ${parts.map(part => createProductCard(part)).join('')}
                </div>
            </div>
        </section>
    `;
};

const faqPage = () => {
    const faqs = window.productData?.faqs || [];
    return `
        <!-- Customer Q&A / FAQ Section -->
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Get answers to common questions about our products and services</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>

                <div class="max-w-4xl mx-auto">
                    ${faqs.map((faq, index) => `
                        <div class="faq-item">
                            <div class="faq-question" onclick="toggleFAQ(this)">
                                <span>${faq.question}</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>${faq.answer}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="text-center mt-12">
                    <div class="bg-green-50 p-6 rounded-lg inline-block max-w-2xl">
                        <h3 class="text-xl font-bold text-gray-800 mb-3">Still have questions?</h3>
                        <p class="text-gray-600 mb-4">Our team is ready to help you via WhatsApp for instant responses</p>
                        <a href="https://wa.me/254758772539?text=Hello%20KAPEYAMAHA,%20I%20have%20a%20question%20about%3A%20" 
                           target="_blank"
                           class="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                            <i class="fab fa-whatsapp mr-2 text-xl"></i>
                            Ask on WhatsApp Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `;
};

const contactPage = () => `
    <!-- Contact Section -->
    <section class="py-16 bg-gray-800 text-white">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold mb-4">Contact Us</h2>
                <p class="max-w-2xl mx-auto">Have questions? Reach out to our team for assistance</p>
                <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h3 class="text-xl font-semibold mb-6">Get In Touch</h3>
                    
                    <div class="mb-6">
                        <div class="flex items-start mb-4">
                            <i class="fas fa-map-marker-alt text-red-600 mt-1 mr-4"></i>
                            <div>
                                <h4 class="font-medium">Address</h4>
                                <p class="text-gray-300">Kapeyamaha Enterprises Limited</p>
                                <p class="text-gray-300">Kitale-Lodwar Highway</p>
                                <p class="text-gray-300">Kapenguria, Kenya</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start mb-4">
                            <i class="fas fa-phone-alt text-red-600 mt-1 mr-4"></i>
                            <div>
                                <h4 class="font-medium">Phone & WhatsApp</h4>
                                <p class="text-gray-300">+254 758 772 539</p>
                                <p class="text-gray-300">24/7 Customer Support</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start">
                            <i class="fas fa-envelope text-red-600 mt-1 mr-4"></i>
                            <div>
                                <h4 class="font-medium">Email</h4>
                                <p class="text-gray-300">kapeyamaha@gmail.com</p>
                                <p class="text-gray-300">sales@kapeyamaha.co.ke</p>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-semibold mb-4">Business Hours</h3>
                    <div class="text-gray-300">
                        <p class="mb-1"><strong>Vehicle Sales:</strong> Mon-Sat: 8:00 AM - 6:00 PM</p>
                        <p class="mb-1"><strong>Parts Department:</strong> Mon-Fri: 8:00 AM - 5:00 PM</p>
                        <p class="mb-1"><strong>Service Center:</strong> Mon-Sat: 7:30 AM - 5:30 PM</p>
                        <p>Sunday: Closed (Emergency Service Available)</p>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-semibold mb-6">Send Us a Message</h3>
                    <form id="contact-form" class="space-y-4">
                        <div>
                            <label for="contact-name" class="block mb-1">Name *</label>
                            <input type="text" id="contact-name" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600">
                        </div>
                        
                        <div>
                            <label for="contact-email" class="block mb-1">Email *</label>
                            <input type="email" id="contact-email" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600">
                        </div>
                        
                        <div>
                            <label for="contact-subject" class="block mb-1">Subject</label>
                            <select id="contact-subject" class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600">
                                <option value="general">General Inquiry</option>
                                <option value="sales">Vehicle Sales</option>
                                <option value="parts">Spare Parts</option>
                                <option value="service">Vehicle Service</option>
                            </select>
                        </div>
                        
                        <div>
                            <label for="contact-message" class="block mb-1">Message *</label>
                            <textarea id="contact-message" rows="4" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600"></textarea>
                        </div>
                        
                        <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition duration-300">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
`;

const notFoundPage = () => `
    <section class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Page not found</p>
            <a href="/" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Go back home
            </a>
        </div>
    </section>
`;

// Route Handlers
function handleHome() {
    currentRoute = '/';
    updateNavigation(currentRoute);
    render(homePage());
    initPage();
}

function handleCars() {
    currentRoute = '/cars';
    updateNavigation(currentRoute);
    render(carsPage());
    initPage();
}

function handleBikes() {
    currentRoute = '/bikes';
    updateNavigation(currentRoute);
    render(bikesPage());
    initPage();
}

function handleVehicles() {
    currentRoute = '/vehicles';
    updateNavigation(currentRoute);
    render(vehiclesPage());
    initPage();
}

function handleParts() {
    currentRoute = '/parts';
    updateNavigation(currentRoute);
    render(partsPage());
    initPage();
}

function handleFAQ() {
    currentRoute = '/faq';
    updateNavigation(currentRoute);
    render(faqPage());
    initPage();
}

function handleContact() {
    currentRoute = '/contact';
    updateNavigation(currentRoute);
    render(contactPage());
    initPage();
}

function handleNotFound() {
    currentRoute = '/404';
    updateNavigation('/');
    render(notFoundPage());
    initPage();
}

// Initialize page functionality
function initPage() {
    // Initialize event listeners for product cards
    setTimeout(() => {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addToCart(productId);
            });
        });

        // View details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                showProductDetails(productId);
            });
        });

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('contact-name').value;
                const email = document.getElementById('contact-email').value;
                
                showNotification(`Thank you for your message, ${name}! We will contact you at ${email} shortly.`);
                contactForm.reset();
            });
        }
    }, 100);
}

// Cart Functions
function addToCart(productId) {
    if (!window.productData) return;
    
    // Find product in all categories
    let product = null;
    const categories = ['yamahaBikes', 'toyotaCars', 'commercialVehicles', 'spareParts'];
    
    for (const category of categories) {
        if (window.productData[category]) {
            product = window.productData[category].find(p => p.id === productId);
            if (product) break;
        }
    }
    
    if (!product) return;
    
    const existingItem = window.appState.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        window.appState.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            category: product.category,
            image: product.image
        });
    }
    
    localStorage.setItem('kapeyamaha-cart', JSON.stringify(window.appState.cart));
    updateCartCount();
    showNotification(`Added ${product.name} to cart!`);
}

function updateCartCount() {
    const count = window.appState.cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

function showProductDetails(productId) {
    if (!window.productData) return;
    
    // Find product
    let product = null;
    const categories = ['yamahaBikes', 'toyotaCars', 'commercialVehicles', 'spareParts'];
    
    for (const category of categories) {
        if (window.productData[category]) {
            product = window.productData[category].find(p => p.id === productId);
            if (product) break;
        }
    }
    
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div>
                <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg">
            </div>
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">${product.name}</h2>
                <div class="text-3xl font-bold text-red-600 mb-4">$${product.price.toLocaleString()}</div>
                <p class="text-gray-600 mb-4">${product.description}</p>
                
                ${product.features ? `
                <div class="mb-4">
                    <h3 class="text-lg font-semibold mb-2">Features:</h3>
                    <div class="grid grid-cols-2 gap-2">
                        ${product.features.map(feature => `
                            <div class="bg-gray-50 p-2 rounded">
                                <span class="text-sm text-gray-700">${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="flex space-x-4 mt-6">
                    <button class="add-to-cart-detail-btn flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition duration-300"
                            data-id="${product.id}">
                        Add to Cart
                    </button>
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
}

// Setup Routes
function setupRoutes() {
    // Define routes
    page('/', handleHome);
    page('/cars', handleCars);
    page('/bikes', handleBikes);
    page('/vehicles', handleVehicles);
    page('/parts', handleParts);
    page('/faq', handleFAQ);
    page('/contact', handleContact);
    page('*', handleNotFound);
    
    // Start the router
    page.start();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const path = this.getAttribute('href');
            page(path);
        });
    });
    
    // Mobile menu links
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const path = this.getAttribute('href');
            page(path);
            // Close mobile menu
            document.getElementById('mobile-menu').classList.add('hidden');
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (window.appState.cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            document.getElementById('cart-preview').style.display = 'none';
            document.getElementById('checkout-modal').style.display = 'flex';
        });
    }
    
    // Manual payment button
    const manualPaymentBtn = document.getElementById('manual-payment-btn');
    if (manualPaymentBtn) {
        manualPaymentBtn.addEventListener('click', () => {
            showManualPaymentInstructions();
        });
    }
}

// Initialize the application
function initApp() {
    // Load initial cart state
    if (localStorage.getItem('kapeyamaha-cart')) {
        window.appState.cart = JSON.parse(localStorage.getItem('kapeyamaha-cart'));
    }
    
    // Update cart count
    updateCartCount();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup routes
    setupRoutes();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}