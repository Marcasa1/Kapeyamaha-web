const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/Order');

// Stripe Payment Intent
exports.createStripePayment = async (req, res) => {
  try {
    const { orderId, amount, currency = 'usd' } = req.body;

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

// Stripe Webhook
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// PayPal Create Order
exports.createPayPalOrder = async (req, res) => {
  try {
    const { orderId, amount, currency = 'USD' } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // PayPal environment
    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );
    
    if (process.env.PAYPAL_MODE === 'live') {
      environment = new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
    }

    const client = new paypal.core.PayPalHttpClient(environment);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: order.orderNumber,
        amount: {
          currency_code: currency,
          value: amount.toString(),
          breakdown: {
            item_total: {
              currency_code: currency,
              value: order.subtotal.toString()
            },
            shipping: {
              currency_code: currency,
              value: order.shippingCost.toString()
            },
            tax_total: {
              currency_code: currency,
              value: order.tax.toString()
            }
          }
        },
        items: order.items.map(item => ({
          name: item.name,
          unit_amount: {
            currency_code: currency,
            value: item.price.toString()
          },
          quantity: item.quantity.toString()
        }))
      }],
      application_context: {
        brand_name: 'KAPEYAMAHA Enterprises',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`
      }
    });

    const response = await client.execute(request);
    
    res.status(200).json({
      success: true,
      orderID: response.result.id,
      approvalUrl: response.result.links.find(link => link.rel === 'approve').href
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating PayPal order',
      error: error.message
    });
  }
};

// PayPal Capture Order
exports.capturePayPalOrder = async (req, res) => {
  try {
    const { orderID } = req.body;

    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );
    
    if (process.env.PAYPAL_MODE === 'live') {
      environment = new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
    }

    const client = new paypal.core.PayPalHttpClient(environment);
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const response = await client.execute(request);

    // Update order status
    const order = await Order.findOne({ orderNumber: response.result.purchase_units[0].reference_id });
    if (order) {
      order.paymentStatus = 'completed';
      order.orderStatus = 'confirmed';
      order.paymentId = response.result.id;
      order.paymentDetails = response.result;
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment captured successfully',
      data: response.result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error capturing payment',
      error: error.message
    });
  }
};

// M-Pesa Payment (Kenya specific)
exports.createMpesaPayment = async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body;

    // This is a simplified version. You'll need to integrate with Safaricom API
    // Refer to: https://developer.safaricom.co.ke/
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString('base64');

    // In production, you would make actual API calls to M-Pesa
    const response = {
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CheckoutRequestID: `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      MerchantRequestID: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Store payment details
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = 'processing';
      order.paymentId = response.CheckoutRequestID;
      order.paymentDetails = {
        phone,
        amount,
        method: 'mpesa'
      };
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'M-Pesa payment initiated',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initiating M-Pesa payment',
      error: error.message
    });
  }
};

// Helper functions
async function handleSuccessfulPayment(paymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  
  const order = await Order.findById(orderId);
  if (order) {
    order.paymentStatus = 'completed';
    order.orderStatus = 'confirmed';
    order.paymentId = paymentIntent.id;
    await order.save();
    
    // Send confirmation email
    await sendOrderConfirmation(order, order.customer.email);
  }
}

async function handleFailedPayment(paymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  
  const order = await Order.findById(orderId);
  if (order) {
    order.paymentStatus = 'failed';
    await order.save();
  }
}