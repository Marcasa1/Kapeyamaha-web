// Main Application Script

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('kapeyamaha-cart')) || [];

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

// FAQ Toggle Function
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('i');
    
    element.classList.toggle('active');
    answer.classList.toggle('open');
    
    // Close other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.querySelector('.faq-question').classList.remove('active');
            item.querySelector('.faq-answer').classList.remove('open');
        }
    });
}

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    displayYamahaBikes();
    displayToyotaCars();
    displayCommercialVehicles();
    displaySpareParts();
    displayFeaturedParts();
    
    // Event delegation for product actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details-btn') || 
            e.target.closest('.view-details-btn')) {
            const button = e.target.closest('.view-details-btn');
            const productId = button.getAttribute('data-id');
            showProductDetails(productId);
        }
        
        if (e.target.classList.contains('add-to-cart-btn') || 
            e.target.closest('.add-to-cart-btn')) {
            const button = e.target.closest('.add-to-cart-btn');
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        }
        
        // Add to cart from detail modal
        if (e.target.classList.contains('add-to-cart-detail-btn')) {
            const button = e.target.closest('.add-to-cart-detail-btn');
            const productId = button.getAttribute('data-id');
            addToCart(productId);
            showNotification(`Added product to cart!`);
        }
        
        // Buy now from detail modal
        if (e.target.classList.contains('buy-now-btn')) {
            const button = e.target.closest('.buy-now-btn');
            const productId = button.getAttribute('data-id');
            addToCart(productId);
            document.getElementById('product-modal').style.display = 'none';
            document.getElementById('cart-preview').style.display = 'none';
            document.getElementById('checkout-modal').style.display = 'flex';
            updateCheckoutSummary();
        }
    });
    
    // Category filter buttons
    document.querySelectorAll('.category-filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            document.querySelectorAll('.category-filter-btn').forEach(btn => {
                btn.classList.remove('bg-red-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-800');
            });
            
            this.classList.remove('bg-white', 'text-gray-800');
            this.classList.add('bg-red-600', 'text-white');
            
            displaySpareParts(12, category);
        });
    });
    
    // Load more buttons
    document.getElementById('load-more-bikes')?.addEventListener('click', () => {
        displayYamahaBikes('all');
        document.getElementById('load-more-bikes').style.display = 'none';
    });
    
    document.getElementById('load-more-cars')?.addEventListener('click', () => {
        displayToyotaCars('all');
        document.getElementById('load-more-cars').style.display = 'none';
    });
    
    document.getElementById('load-more-vehicles')?.addEventListener('click', () => {
        displayCommercialVehicles('all');
        document.getElementById('load-more-vehicles').style.display = 'none';
    });
    
    document.getElementById('load-more-parts')?.addEventListener('click', () => {
        displaySpareParts('all');
        document.getElementById('load-more-parts').style.display = 'none';
    });
    
    // Cart functionality
    document.getElementById('cart-icon')?.addEventListener('click', () => {
        updateCartPreview();
        document.getElementById('cart-preview').style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    document.querySelector('.close-cart')?.addEventListener('click', () => {
        document.getElementById('cart-preview').style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('cart-preview')) {
            document.getElementById('cart-preview').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Checkout button
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        document.getElementById('cart-preview').style.display = 'none';
        document.body.style.overflow = 'auto';
        updateCheckoutSummary();
        document.getElementById('checkout-modal').style.display = 'flex';
    });
    
    // Set default active category filter
    const allCategoryBtn = document.querySelector('.category-filter-btn[data-category="all"]');
    if (allCategoryBtn) {
        allCategoryBtn.classList.remove('bg-white', 'text-gray-800');
        allCategoryBtn.classList.add('bg-red-600', 'text-white');
    }
    
    // Modal close functionality
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const phone = document.getElementById('contact-phone').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, phone, subject, message })
                });
                
                const data = await response.json();
                showNotification(data.message);
                contactForm.reset();
            } catch (error) {
                showNotification('Failed to send message. Please try again or contact us via WhatsApp.', 'error');
            }
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email').value;
            
            try {
                const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                showNotification(data.message);
                newsletterForm.reset();
            } catch (error) {
                showNotification('Failed to subscribe. Please try again.', 'error');
            }
        });
    }
    
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
});