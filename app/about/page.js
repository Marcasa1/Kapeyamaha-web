// page.js - Client-side router for KAPEYAMAHA LIMITED

import page from 'page';

// Base URL setup
const baseUrl = window.location.origin;

// DOM elements
const appContainer = document.getElementById('app-content') || document.body;
const header = document.querySelector('header');
const footer = document.querySelector('footer');

// State management
let currentPage = 'home';
let cart = JSON.parse(localStorage.getItem('kapeyamaha-cart')) || [];

// Layout template with navigation
const layout = (content, title = 'KAPEYAMAHA LIMITED') => `
    <div id="dynamic-content">
        ${content}
    </div>
`;

// Page Components
const HomePage = () => `
    <!-- Hero Section -->
    <section id="home" class="hero-bg text-white py-20 md:py-32">
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
`;

const CarsPage = () => {
    // This would fetch car data or use static data
    const cars = [
        {
            id: "car-01",
            name: "Toyota Land Cruiser 300",
            price: 125000,
            image: "images/vehicles/toyota-land-cruiser-300.jpg",
            description: "Flagship luxury SUV with 3.5L twin-turbo V6 engine"
        },
        // ... more cars
    ];
    
    return `
        <!-- Toyota Cars Section -->
        <section id="cars" class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Toyota Car Collection</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Reliability, performance, and luxury in our curated Toyota collection</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="cars-container">
                    ${cars.map(car => `
                        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                            <img src="${car.image}" alt="${car.name}" class="w-full h-48 object-cover">
                            <div class="p-4">
                                <h3 class="text-lg font-bold text-gray-800 mb-2">${car.name}</h3>
                                <p class="text-gray-600 text-sm mb-3">${car.description}</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-red-600">$${car.price.toLocaleString()}</span>
                                    <button class="add-to-cart bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition duration-300"
                                            data-id="${car.id}">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
};

const BikesPage = () => {
    return `
        <!-- Yamaha Motorbikes Section -->
        <section id="bikes" class="py-16 bg-gray-50">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Yamaha Motorbike Collection</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Discover our range of high-performance Yamaha motorcycles for every rider</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="bikes-container">
                    <!-- Bikes will be loaded dynamically -->
                </div>
            </div>
        </section>
    `;
};

const VehiclesPage = () => {
    return `
        <!-- Commercial Vehicles Section -->
        <section id="vehicles" class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Commercial & Utility Vehicles</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Reliable commercial vehicles for business and utility purposes</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="vehicles-container">
                    <!-- Vehicles will be loaded dynamically -->
                </div>
            </div>
        </section>
    `;
};

const PartsPage = () => {
    return `
        <!-- Spare Parts Section -->
        <section id="spare-parts" class="py-16 bg-gray-50">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Genuine Spare Parts</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Original Toyota & Yamaha spare parts for optimal performance and longevity</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>
                
                <!-- Parts will be loaded dynamically -->
            </div>
        </section>
    `;
};

const FAQPage = () => {
    return `
        <!-- Customer Q&A / FAQ Section -->
        <section id="faq" class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Get answers to common questions about our products and services</p>
                    <div class="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
                </div>

                <div class="max-w-4xl mx-auto">
                    <!-- FAQ items will be loaded dynamically -->
                </div>
            </div>
        </section>
    `;
};

const ContactPage = () => {
    return `
        <!-- Contact Section -->
        <section id="contact" class="py-16 bg-gray-800 text-white">
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
                                </div>
                            </div>
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
};

const NotFoundPage = () => `
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

// Helper functions
function updateNavigation(currentPage) {
    // Update active state in navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `/${currentPage}`) {
            link.classList.add('active-nav');
        }
    });
    
    // Update page title
    document.title = `KAPEYAMAHA LIMITED - ${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}`;
}

function fadeInContent() {
    const content = document.getElementById('dynamic-content');
    content.style.opacity = '0';
    content.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        content.style.opacity = '1';
    }, 10);
}

// Route Handlers
function home(ctx) {
    currentPage = 'home';
    appContainer.innerHTML = layout(HomePage(), 'Home - KAPEYAMAHA LIMITED');
    updateNavigation('home');
    fadeInContent();
    initializeHomePage();
}

function cars(ctx) {
    currentPage = 'cars';
    appContainer.innerHTML = layout(CarsPage(), 'Toyota Cars - KAPEYAMAHA LIMITED');
    updateNavigation('cars');
    fadeInContent();
    initializeCarsPage();
}

function bikes(ctx) {
    currentPage = 'bikes';
    appContainer.innerHTML = layout(BikesPage(), 'Yamaha Bikes - KAPEYAMAHA LIMITED');
    updateNavigation('bikes');
    fadeInContent();
    initializeBikesPage();
}

function vehicles(ctx) {
    currentPage = 'vehicles';
    appContainer.innerHTML = layout(VehiclesPage(), 'Commercial Vehicles - KAPEYAMAHA LIMITED');
    updateNavigation('vehicles');
    fadeInContent();
    initializeVehiclesPage();
}

function parts(ctx) {
    currentPage = 'parts';
    appContainer.innerHTML = layout(PartsPage(), 'Spare Parts - KAPEYAMAHA LIMITED');
    updateNavigation('parts');
    fadeInContent();
    initializePartsPage();
}

function faq(ctx) {
    currentPage = 'faq';
    appContainer.innerHTML = layout(FAQPage(), 'FAQ - KAPEYAMAHA LIMITED');
    updateNavigation('faq');
    fadeInContent();
    initializeFAQPage();
}

function contact(ctx) {
    currentPage = 'contact';
    appContainer.innerHTML = layout(ContactPage(), 'Contact - KAPEYAMAHA LIMITED');
    updateNavigation('contact');
    fadeInContent();
    initializeContactPage();
}

function notFound(ctx) {
    appContainer.innerHTML = layout(NotFoundPage(), 'Page Not Found - KAPEYAMAHA LIMITED');
    updateNavigation('');
    fadeInContent();
}

// Initialize functions for each page
function initializeHomePage() {
    // Add any home page specific initialization
    console.log('Home page initialized');
}

function initializeCarsPage() {
    // Load car data and attach event listeners
    console.log('Cars page initialized');
    
    // Attach add to cart event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            console.log('Adding product to cart:', productId);
            // Implement add to cart functionality
        });
    });
}

function initializeBikesPage() {
    console.log('Bikes page initialized');
}

function initializeVehiclesPage() {
    console.log('Vehicles page initialized');
}

function initializePartsPage() {
    console.log('Parts page initialized');
}

function initializeFAQPage() {
    // Initialize FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle active class
            this.classList.toggle('active');
            
            // Toggle icon rotation
            if (this.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
            } else {
                icon.style.transform = 'rotate(0deg)';
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
            }
        });
    });
}

function initializeContactPage() {
    // Initialize contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            
            // Here you would normally send the data to a server
            console.log('Contact form submitted:', { name, email, message });
            
            // Show success message
            alert('Thank you for your message! We will contact you soon.');
            contactForm.reset();
        });
    }
}

// Setup routes
function setupRoutes() {
    // Define routes
    page('/', home);
    page('/cars', cars);
    page('/bikes', bikes);
    page('/vehicles', vehicles);
    page('/parts', parts);
    page('/faq', faq);
    page('/contact', contact);
    page('*', notFound);
    
    // Start the router
    page.start();
}

// Initialize the application
function initApp() {
    // Setup event listeners for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const path = this.getAttribute('href');
            page(path);
        });
    });
    
    // Setup mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Setup cart functionality
    initializeCart();
    
    // Setup routes
    setupRoutes();
}

// Initialize cart functionality
function initializeCart() {
    // Load cart from localStorage
    cart = JSON.parse(localStorage.getItem('kapeyamaha-cart')) || [];
    
    // Update cart count
    updateCartCount();
    
    // Setup cart icon click
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', showCartPreview);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function showCartPreview() {
    const cartPreview = document.getElementById('cart-preview');
    if (cartPreview) {
        cartPreview.style.display = 'block';
        renderCartItems();
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Your cart is empty</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between py-3 border-b">
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                <div class="ml-3">
                    <h4 class="font-medium text-sm">${item.name}</h4>
                    <p class="text-red-600 font-bold">$${item.price.toLocaleString()} × ${item.quantity}</p>
                </div>
            </div>
            <button class="remove-item text-gray-500 hover:text-red-600" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initApp, layout };
}

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}