const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderConfirmation } = require('../utils/emailService');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, customer, shipping, paymentMethod, notes } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    // Check stock and get product details
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const price = product.discountedPrice || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: price,
        image: product.images[0]?.url
      });
    }

    // Calculate shipping and tax
    const shippingCost = shipping?.cost || 50;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = await Order.create({
      items: orderItems,
      customer,
      shipping: {
        method: shipping?.method || 'standard',
        cost: shippingCost
      },
      subtotal,
      shippingCost,
      tax,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      notes
    });

    // Reduce stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Send confirmation email
    await sendOrderConfirmation(order, customer.email);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.customer.email !== req.user?.email && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ 'customer.email': email })
      .sort('-createdAt')
      .populate('items.product', 'name images');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .populate('items.product', 'name images'),
      Order.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updates = {};
    if (status) {
      updates.orderStatus = status;
      if (status === 'delivered') updates['shipping.deliveredAt'] = new Date();
    }
    if (trackingNumber) updates['shipping.trackingNumber'] = trackingNumber;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    // Send status update email
    if (status && status !== order.orderStatus) {
      await sendOrderStatusUpdate(updatedOrder);
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};