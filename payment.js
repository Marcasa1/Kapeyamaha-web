// payment.js - Payment Management System

class PaymentManager {
    constructor() {
        this.paypalInitialized = false;
        this.stripeInitialized = false;
        this.stripe = null;
        this.cardElement = null;
        this.init();
    }

    // Initialize payment system
    init() {
        this.setupPaymentListeners();
        this.initializePayPal();
        this.initializeStripe();
    }

    // Setup payment event listeners
    setupPaymentListeners() {
        // Manual payment button
        const manualPaymentBtn = document.getElementById('manual-payment-btn');
        if (manualPaymentBtn) {
            manualPaymentBtn.addEventListener('click', () => this.showManualPaymentInstructions());
        }

        // M-Pesa payment button
        const mpesaPaymentBtn = document.getElementById('mpesa-payment-btn');
        if (mpesaPaymentBtn) {
            mpesaPaymentBtn.addEventListener('click', () => this.showMpesaInstructions());
        }

        // Credit card form submission
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => this.handleCardPayment(e));
        }
    }

    // Initialize PayPal
    initializePayPal() {
        if (typeof paypal === 'undefined') {
            console.error('PayPal SDK not loaded');
            this.showPaymentNotification('PayPal payment system is currently unavailable. Please try another payment method.', 'error');
            return;
        }

        try {
            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'paypal'
                },
                createOrder: (data, actions) => {
                    return this.createPayPalOrder();
                },
                onApprove: (data, actions) => {
                    return this.handlePayPalApproval(data, actions);
                },
                onError: (error) => {
                    console.error('PayPal Error:', error);
                    this.handlePaymentError('PayPal payment failed. Please try another payment method.');
                },
                onCancel: (data) => {
                    this.showPaymentNotification('PayPal payment was cancelled.', 'warning');
                }
            }).render('#paypal-button-container');
            
            this.paypalInitialized = true;
        } catch (error) {
            console.error('Error initializing PayPal:', error);
            this.showPaymentNotification('Unable to initialize PayPal. Please try again later.', 'error');
        }
    }

    // Create PayPal order
    async createPayPalOrder() {
        try {
            const cart = JSON.parse(localStorage.getItem('kapeyamaha-cart')) || [];
            if (cart.length === 0) {
                throw new Error('Cart is empty');
            }

            // Calculate totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = 50.00;
            const tax = subtotal * 0.08;
            const total = subtotal + shipping + tax;

            // Create order details
            const items = cart.map(item => ({
                name: item.name.substring(0, 127), // PayPal max length
                quantity: item.quantity.toString(),
                unit_amount: {
                    currency_code: 'USD',
                    value: item.price.toFixed(2)
                }
            }));

            // For demo purposes, we'll simulate order creation
            // In production, you would call your backend API
            const orderData = {
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: total.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: subtotal.toFixed(2)
                            },
                            shipping: {
                                currency_code: 'USD',
                                value: shipping.toFixed(2)
                            },
                            tax_total: {
                                currency_code: 'USD',
                                value: tax.toFixed(2)
                            }
                        }
                    },
                    items: items,
                    description: `Order from KAPEYAMAHA LIMITED - ${cart.length} item(s)`
                }],
                application_context: {
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    return_url: window.location.href,
                    cancel_url: window.location.href
                }
            };

            // Simulate API call for demo
            console.log('Creating PayPal order:', orderData);
            
            // Return a mock order ID for demo
            // In production, this would be your actual order ID from PayPal API
            return `DEMO-ORDER-${Date.now()}`;

        } catch (error) {
            console.error('Error creating PayPal order:', error);
            this.handlePaymentError('Failed to create payment order. Please try again.');
            throw error;
        }
    }

    // Handle PayPal approval
    async handlePayPalApproval(data, actions) {
        try {
            this.showPaymentProcessing(true);
            
            // In production, you would capture the payment on your server
            console.log('PayPal order approved:', data.orderID);
            
            // Simulate API call for demo
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo, simulate successful payment
            const result = {
                status: 'COMPLETED',
                id: data.orderID,
                create_time: new Date().toISOString()
            };

            if (result.status === 'COMPLETED') {
                this.handlePaymentSuccess(result);
            } else {
                throw new Error('Payment not completed');
            }

        } catch (error) {
            console.error('Error capturing PayPal payment:', error);
            this.handlePaymentError('Payment processing failed. Please contact support.');
        } finally {
            this.showPaymentProcessing(false);
        }
    }

    // Initialize Stripe
    async initializeStripe() {
        try {
            // For demo, we'll use a test publishable key
            // Replace with your actual Stripe publishable key in production
            const stripePublishableKey = 'pk_test_51KQx2jSJt8x1x9Y7Q2K8Z9Xw7R3cY6aF8gH2jL9pQ6rT4vN8z'; // This is a test key
            
            if (!stripePublishableKey || stripePublishableKey.includes('test')) {
                console.warn('Using Stripe test mode');
            }

            // Load Stripe.js
            if (typeof Stripe === 'undefined') {
                console.error('Stripe.js not loaded');
                this.showPaymentNotification('Credit card payment is currently unavailable.', 'error');
                return;
            }

            // Initialize Stripe
            this.stripe = Stripe(stripePublishableKey);
            
            // Create elements
            const elements = this.stripe.elements();
            this.cardElement = elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#32325d',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        '::placeholder': {
                            color: '#aab7c4'
                        },
                        ':-webkit-autofill': {
                            color: '#32325d'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                },
                hidePostalCode: true
            });

            // Mount card element
            const cardElementContainer = document.getElementById('card-element');
            if (cardElementContainer) {
                this.cardElement.mount(cardElementContainer);
                
                // Handle real-time validation errors
                this.cardElement.on('change', (event) => {
                    const displayError = document.getElementById('card-errors');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });
                
                this.stripeInitialized = true;
            }

        } catch (error) {
            console.error('Error initializing Stripe:', error);
            this.showPaymentNotification('Unable to initialize credit card payments. Please try another method.', 'error');
        }
    }

    // Handle card payment
    async handleCardPayment(e) {
        e.preventDefault();
        
        if (!this.stripeInitialized || !this.cardElement) {
            this.handlePaymentError('Payment system not ready. Please refresh the page.');
            return;
        }

        const cardholderName = document.getElementById('cardholder-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const termsAccepted = document.getElementById('terms').checked;

        // Validate form
        if (!cardholderName || !email || !termsAccepted) {
            this.handlePaymentError('Please fill all required fields and accept terms & conditions.');
            return;
        }

        if (!this.validateEmail(email)) {
            this.handlePaymentError('Please enter a valid email address.');
            return;
        }

        this.showPaymentProcessing(true);

        try {
            // Create payment method
            const { paymentMethod, error } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.cardElement,
                billing_details: {
                    name: cardholderName,
                    email: email,
                    address: {
                        country: 'KE' // Default to Kenya
                    }
                }
            });

            if (error) {
                throw error;
            }

            // For demo, simulate successful payment
            console.log('Payment method created:', paymentMethod.id);
            
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate successful payment
            const paymentResult = {
                success: true,
                paymentMethodId: paymentMethod.id,
                amount: this.calculateTotalAmount(),
                currency: 'usd',
                receipt_email: email
            };

            if (paymentResult.success) {
                this.handlePaymentSuccess(paymentResult);
            } else {
                throw new Error('Payment failed');
            }

        } catch (error) {
            console.error('Payment error:', error);
            
            let errorMessage = 'Payment failed. ';
            if (error.type === 'validation_error') {
                errorMessage += 'Please check your card details.';
            } else if (error.type === 'card_error') {
                errorMessage += error.message;
            } else {
                errorMessage += 'Please try another payment method.';
            }
            
            this.handlePaymentError(errorMessage);
            
            // Show error in card errors div
            const displayError = document.getElementById('card-errors');
            if (displayError) {
                displayError.textContent = error.message || 'An error occurred';
            }
        } finally {
            this.showPaymentProcessing(false);
        }
    }

    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Show manual payment instructions
    showManualPaymentInstructions() {
        const instructions = `
BANK TRANSFER INSTRUCTIONS

KAPEYAMAHA ENTERPRISES LIMITED
Kitale-Lodwar Highway, Kapenguria
P.O. Box 654-30600

BANK ACCOUNTS:

1. EQUITY BANK KENYA
   Account Name: KAPEYAMAHA ENTERPRISES LIMITED
   Account Number: 1234567890
   Branch: Nairobi Main Branch
   SWIFT Code: EQBLKENA

2. KCB BANK KENYA
   Account Name: KAPEYAMAHA ENTERPRISES LIMITED
   Account Number: 0987654321
   Branch: Kapenguria Branch
   SWIFT Code: KCBLKENX

3. CO-OPERATIVE BANK
   Account Name: KAPEYAMAHA ENTERPRISES LIMITED
   Account Number: 1122334455
   Branch: Kitale Branch
   SWIFT Code: KCOOKENA

PAYMENT PROCEDURE:
1. Transfer the total amount to any of the accounts above
2. Use your order number as reference: ORDER-${Date.now().toString().slice(-8)}
3. Send payment confirmation to: kapeyamaha@gmail.com
4. WhatsApp payment slip to: +254 758 772 539

IMPORTANT NOTES:
✓ Payments are processed within 24-48 hours
✓ Include your full name and contact details
✓ Order will be shipped after payment confirmation
✓ Contact us for any assistance

THANK YOU FOR YOUR BUSINESS!
        `;

        // Create a modal for bank details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold">Bank Transfer Details</h2>
                        <button class="modal-close text-2xl">&times;</button>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                        <pre style="white-space: pre-wrap; font-family: monospace; font-size: 14px;">${instructions}</pre>
                    </div>
                    <div class="flex gap-3">
                        <button id="copy-bank-details" class="btn btn-primary flex-1">
                            <i class="fas fa-copy mr-2"></i>Copy Details
                        </button>
                        <button id="print-bank-details" class="btn btn-secondary flex-1">
                            <i class="fas fa-print mr-2"></i>Print
                        </button>
                        <button class="btn btn-outline flex-1 close-bank-modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });

        modal.querySelector('.close-bank-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });

        modal.querySelector('#copy-bank-details').addEventListener('click', () => {
            navigator.clipboard.writeText(instructions)
                .then(() => {
                    this.showPaymentNotification('Bank details copied to clipboard!', 'success');
                })
                .catch(() => {
                    this.showPaymentNotification('Failed to copy. Please select and copy manually.', 'warning');
                });
        });

        modal.querySelector('#print-bank-details').addEventListener('click', () => {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>KAPEYAMAHA - Bank Details</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #ef4444; }
                            pre { background: #f3f4f6; padding: 20px; border-radius: 5px; }
                        </style>
                    </head>
                    <body>
                        <h1>KAPEYAMAHA ENTERPRISES LIMITED</h1>
                        <pre>${instructions}</pre>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Show M-Pesa instructions
    showMpesaInstructions() {
        const instructions = `
M-PESA PAYMENT INSTRUCTIONS

COMING SOON!

We are currently setting up our M-Pesa payment system.
M-Pesa payments will be available soon for your convenience.

For now, please use:
✓ PayPal
✓ Credit/Debit Card
✓ Bank Transfer

Or contact us directly for alternative arrangements:

WhatsApp: +254 758 772 539
Email: kapeyamaha@gmail.com

Thank you for your patience!
        `;

        // Create a modal for M-Pesa info
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="p-6 text-center">
                    <div class="text-yellow-500 text-5xl mb-4">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h2 class="text-2xl font-bold mb-4">M-Pesa Payment</h2>
                    <div class="bg-yellow-50 p-4 rounded-lg mb-6">
                        <pre style="white-space: pre-wrap; font-family: monospace; font-size: 14px;">${instructions}</pre>
                    </div>
                    <button class="btn btn-primary w-full close-mpesa-modal">
                        OK, I Understand
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal
        modal.querySelector('.close-mpesa-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Calculate total amount
    calculateTotalAmount() {
        const cart = JSON.parse(localStorage.getItem('kapeyamaha-cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 50.00;
        const tax = subtotal * 0.08;
        return Math.round((subtotal + shipping + tax) * 100); // Convert to cents
    }

    // Handle payment success
    handlePaymentSuccess(paymentResult) {
        console.log('Payment successful:', paymentResult);
        
        // Close checkout modal
        const checkoutModal = document.getElementById('checkout-modal');
        if (checkoutModal) {
            checkoutModal.style.display = 'none';
        }

        // Generate receipt
        this.generateReceipt(paymentResult);
        
        // Show success modal
        const successModal = document.getElementById('payment-success-modal');
        if (successModal) {
            successModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // Send confirmation (simulated)
        this.sendConfirmation(paymentResult);
        
        // Clear cart
        localStorage.removeItem('kapeyamaha-cart');
        
        // Update UI if app exists
        if (window.app) {
            window.app.updateCartCount();
            window.app.updateCartPreview();
        }
    }

    // Generate receipt
    generateReceipt(paymentResult) {
        const cart = JSON.parse(localStorage.getItem('kapeyamaha-cart')) || [];
        const receiptContent = document.getElementById('receipt-content');
        
        if (!receiptContent) return;

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 50.00;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;
        const orderNumber = `ORDER-${Date.now().toString().slice(-8)}`;

        let itemsHtml = '';
        cart.forEach(item => {
            itemsHtml += `
                <tr class="border-b">
                    <td class="py-2">${item.name}</td>
                    <td class="py-2 text-center">${item.quantity}</td>
                    <td class="py-2 text-right">$${item.price.toFixed(2)}</td>
                    <td class="py-2 text-right">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `;
        });

        receiptContent.innerHTML = `
            <div class="receipt p-6">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-red-600">KAPEYAMAHA ENTERPRISES LIMITED</h2>
                    <p class="text-gray-600">Kitale-Lodwar Highway, Kapenguria</p>
                    <p class="text-gray-600">P.O. Box 654-30600</p>
                    <p class="text-gray-600">+254 758 772 539 | kapeyamaha@gmail.com</p>
                </div>
                
                <div class="border-t border-b py-3 mb-4">
                    <div class="flex justify-between">
                        <div>
                            <p class="font-bold">Order #: ${orderNumber}</p>
                            <p>Date: ${new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                        <div>
                            <p class="font-bold">Payment Method</p>
                            <p>${paymentResult.id ? 'PayPal' : 'Credit Card'}</p>
                            <p>Status: <span class="text-green-600 font-bold">PAID</span></p>
                        </div>
                    </div>
                </div>
                
                <table class="w-full mb-4">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left py-2">Item</th>
                            <th class="text-center py-2">Qty</th>
                            <th class="text-right py-2">Price</th>
                            <th class="text-right py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                
                <div class="border-t pt-4">
                    <div class="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Shipping:</span>
                        <span>$${shipping.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Tax (8%):</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="mt-6 pt-4 border-t text-center">
                    <p class="text-gray-600 mb-2">Thank you for your purchase!</p>
                    <p class="text-sm text-gray-500">Your order will be processed within 24 hours.</p>
                    <p class="text-sm text-gray-500">For any inquiries, contact us at +254 758 772 539</p>
                </div>
            </div>
        `;
    }

    // Send confirmation (simulated)
    async sendConfirmation(paymentResult) {
        try {
            // In production, this would call your backend API
            console.log('Sending payment confirmation...');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Confirmation sent successfully');
            
        } catch (error) {
            console.error('Error sending confirmation:', error);
        }
    }

    // Handle payment error
    handlePaymentError(message) {
        this.showPaymentNotification(message || 'Payment failed. Please try again.', 'error');
    }

    // Show payment notification
    showPaymentNotification(message, type = 'error') {
        // Use existing notification system or create a new one
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        } else {
            // Fallback to alert
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Show/hide payment processing indicator
    showPaymentProcessing(show) {
        const processingElement = document.getElementById('payment-processing');
        const submitButton = document.getElementById('submit-payment');
        const paypalButtons = document.querySelector('#paypal-button-container');
        
        if (processingElement) {
            processingElement.style.display = show ? 'block' : 'none';
        }
        
        if (submitButton) {
            submitButton.disabled = show;
            submitButton.textContent = show ? 'Processing...' : 'Pay Now';
            submitButton.style.opacity = show ? '0.7' : '1';
        }
        
        if (paypalButtons) {
            paypalButtons.style.opacity = show ? '0.5' : '1';
            paypalButtons.style.pointerEvents = show ? 'none' : 'auto';
        }
    }
}

// Global payment functions
function closePaymentSuccessModal() {
    const modal = document.getElementById('payment-success-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function printReceipt() {
    const receiptContent = document.getElementById('receipt-content');
    if (!receiptContent) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>KAPEYAMAHA - Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt { max-width: 600px; margin: 0 auto; }
                h2 { color: #ef4444; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                .totals { margin-top: 20px; }
                .footer { margin-top: 30px; text-align: center; color: #666; }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${receiptContent.innerHTML}
            <div class="footer">
                <p>Thank you for choosing KAPEYAMAHA!</p>
                <p>www.kapeyamaha.com | +254 758 772 539</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    
    // Wait for content to load before printing
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Initialize payment system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const paymentManager = new PaymentManager();
        window.paymentManager = paymentManager; // Make available globally
        console.log('Payment system initialized');
    } catch (error) {
        console.error('Failed to initialize payment system:', error);
    }
});

// Make functions available globally
window.closePaymentSuccessModal = closePaymentSuccessModal;
window.printReceipt = printReceipt;