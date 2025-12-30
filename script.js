// script.js - Main Application Script

// Import modules
import { ProductManager, CATEGORIES } from './product.js';
import { PaymentManager } from './payment.js';

// Main Application Class
class KapeyamahaApp {
    constructor() {
        this.productManager = new ProductManager();
        this.cart = JSON.parse(localStorage.getItem('kapeyamaha-cart')) || [];
        this.currentView = 'home';
        this.init();
    }

    // Initialize application
    init() {
        this.setupEventListeners();
        this.loadInitialContent();
        this.updateCartCount();
        this.setCurrentYear();
    }

    // Setup event listeners
    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateTo(targetId);
                
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            });
        });

        // Cart icon
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.toggleCart());
        }

        // Close cart button
        const closeCartBtn = document.querySelector('.close-cart');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.closeCart());
        }

        // Close modal buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(btn.closest('.modal')));
        });

        // Window click to close modals
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
            if (e.target.id === 'cart-preview') {
                this.closeCart();
            }
        });

        // Product event delegation
        document.addEventListener('click', (e) => {
            // View details button
            if (e.target.classList.contains('view-details-btn') || 
                e.target.closest('.view-details-btn')) {
                const button = e.target.closest('.view-details-btn');
                const productId = button.getAttribute('data-id');
                this.showProductDetails(productId);
            }

            // Add to cart button
            if (e.target.classList.contains('add-to-cart-btn') || 
                e.target.closest('.add-to-cart-btn')) {
                const button = e.target.closest('.add-to-cart-btn');
                const productId = button.getAttribute('data-id');
                this.addToCart(productId);
            }
        });

        // Load more buttons
        document.getElementById('load-more-cars')?.addEventListener('click', () => {
            this.loadAllProducts(CATEGORIES.TOYOTA_CARS, 'cars-container');
        });

        document.getElementById('load-more-bikes')?.addEventListener('click', () => {
            this.loadAllProducts(CATEGORIES.YAMAHA_BIKES, 'bikes-container');
        });

        document.getElementById('load-more-vehicles')?.addEventListener('click', () => {
            this.loadAllProducts(CATEGORIES.COMMERCIAL_VEHICLES, 'vehicles-container');
        });

        document.getElementById('load-more-parts')?.addEventListener('click', () => {
            this.loadAllProducts(CATEGORIES.SPARE_PARTS, 'parts-container');
        });

        // Category filter buttons
        document.querySelectorAll('.category-filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                this.filterSpareParts(category);
            });
        });

        // FAQ toggle
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => this.toggleFAQ(question));
        });

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterForm(e));
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.showCheckout());
        }

        // WhatsApp button
        const whatsappBtn = document.querySelector('.whatsapp-float');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', (e) => {
                if (!confirm('You will be redirected to WhatsApp. Continue?')) {
                    e.preventDefault();
                }
            });
        }
    }

    // Load initial content
    loadInitialContent() {
        // Load featured products
        this.productManager.loadFeaturedProducts('featured-parts-container', 4);
        
        // Load initial product grids
        this.productManager.loadProducts(CATEGORIES.YAMAHA_BIKES, 'bikes-container', 6);
        this.productManager.loadProducts(CATEGORIES.TOYOTA_CARS, 'cars-container', 6);
        this.productManager.loadProducts(CATEGORIES.COMMERCIAL_VEHICLES, 'vehicles-container', 6);
        this.productManager.loadProducts(CATEGORIES.SPARE_PARTS, 'parts-container', 12);
    }

    // Navigate to section
    navigateTo(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            this.updateActiveNav(sectionId);
            this.currentView = sectionId;
        }
    }

    // Update active navigation
    updateActiveNav(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Show product details
    showProductDetails(productId) {
        const product = this.productManager.getProductById(productId);
        if (!product) return;

        const modal = document.getElementById('product-modal');
        const content = document.getElementById('modal-content');
        
        content.innerHTML = '';
        content.appendChild(this.productManager.renderProductDetails(product));
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Add event listeners to modal buttons
        const addToCartBtn = content.querySelector('.add-to-cart-detail-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart(productId);
                this.showNotification(`Added ${product.name} to cart!`, 'success');
            });
        }

        const buyNowBtn = content.querySelector('.buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                this.addToCart(productId);
                this.closeModal(modal);
                this.closeCart();
                this.showCheckout();
            });
        }
    }

    // Add to cart
    addToCart(productId) {
        const product = this.productManager.getProductById(productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
                category: product.category
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.updateCartPreview();
        this.showNotification(`Added ${product.name} to cart!`, 'success');
    }

    // Remove from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartPreview();
        this.showNotification('Item removed from cart', 'warning');
    }

    // Update cart count
    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }

    // Update cart preview
    updateCartPreview() {
        const container = document.getElementById('cart-items');
        const itemsCount = document.getElementById('cart-items-count');
        const totalElement = document.getElementById('cart-total');
        
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">Your cart is empty</p>';
            if (itemsCount) itemsCount.textContent = '0';
            if (totalElement) totalElement.textContent = '$0.00';
            return;
        }

        let totalPrice = 0;
        container.innerHTML = '';

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toLocaleString()} × ${item.quantity}</p>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            container.appendChild(cartItem);
        });

        // Add event listeners to remove buttons
        container.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-id');
                this.removeFromCart(productId);
            });
        });

        if (itemsCount) {
            itemsCount.textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
        }
        if (totalElement) {
            totalElement.textContent = `$${totalPrice.toLocaleString()}`;
        }
    }

    // Toggle cart visibility
    toggleCart() {
        const cartPreview = document.getElementById('cart-preview');
        if (cartPreview) {
            this.updateCartPreview();
            cartPreview.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Close cart
    closeCart() {
        const cartPreview = document.getElementById('cart-preview');
        if (cartPreview) {
            cartPreview.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Close modal
    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('kapeyamaha-cart', JSON.stringify(this.cart));
    }

    // Load all products
    loadAllProducts(category, containerId) {
        this.productManager.loadProducts(category, containerId);
        const button = document.querySelector(`#load-more-${category.split('_')[1]}`);
        if (button) {
            button.style.display = 'none';
        }
    }

    // Filter spare parts
    filterSpareParts(category) {
        const container = document.getElementById('parts-container');
        if (!container) return;

        const parts = PRODUCTS[CATEGORIES.SPARE_PARTS];
        const filteredParts = category === 'all' 
            ? parts 
            : parts.filter(part => part.category === category);

        container.innerHTML = '';
        filteredParts.forEach(part => {
            const card = this.productManager.renderProductCard({...part, category: CATEGORIES.SPARE_PARTS});
            container.appendChild(card);
        });

        // Update active filter button
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });
    }

    // Toggle FAQ
    toggleFAQ(question) {
        const faqItem = question.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-icon');

        // Toggle current item
        answer.classList.toggle('active');
        icon?.classList.toggle('active');

        // Close other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.querySelector('.faq-answer').classList.remove('active');
                item.querySelector('.faq-icon')?.classList.remove('active');
            }
        });
    }

    // Handle contact form
    handleContactForm(e) {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const phone = document.getElementById('contact-phone').value;
        const subject = document.getElementById('contact-subject').value;
        
        // Simulate form submission
        this.showNotification(
            `Thank you, ${name}! We will contact you at ${email} or ${phone} regarding your ${subject} inquiry.`,
            'success'
        );
        
        e.target.reset();
    }

    // Handle newsletter form
    handleNewsletterForm(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletter-email').value;
        
        // Simulate subscription
        this.showNotification(
            `Thank you for subscribing with ${email}! You will receive updates from KAPEYAMAHA.`,
            'success'
        );
        
        e.target.reset();
    }

    // Show checkout
    showCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        this.closeCart();
        this.updateCheckoutSummary();
        
        const checkoutModal = document.getElementById('checkout-modal');
        if (checkoutModal) {
            checkoutModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Update checkout summary
    updateCheckoutSummary() {
        const checkoutItems = document.getElementById('checkout-items');
        const subtotalEl = document.getElementById('checkout-subtotal');
        const shippingEl = document.getElementById('checkout-shipping');
        const taxEl = document.getElementById('checkout-tax');
        const totalEl = document.getElementById('checkout-total');
        
        if (!checkoutItems) return;

        let subtotal = 0;
        checkoutItems.innerHTML = '';

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-total-item';
            itemEl.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>$${itemTotal.toLocaleString()}</span>
            `;
            checkoutItems.appendChild(itemEl);
        });

        const shipping = 50.00;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
        if (shippingEl) shippingEl.textContent = `$${shipping.toLocaleString()}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Set current year in footer
    setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new KapeyamahaApp();
    window.app = app; // Make app available globally for debugging
});

// Global utility functions
function printReceipt() {
    window.print();
}

function showPaymentSuccessModal() {
    const modal = document.getElementById('payment-success-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closePaymentSuccessModal() {
    const modal = document.getElementById('payment-success-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Clear cart after successful payment
        if (window.app) {
            window.app.cart = [];
            window.app.saveCart();
            window.app.updateCartCount();
            window.app.updateCartPreview();
        }
    }
}

// Make functions available globally
window.printReceipt = printReceipt;
window.showPaymentSuccessModal = showPaymentSuccessModal;
window.closePaymentSuccessModal = closePaymentSuccessModal;