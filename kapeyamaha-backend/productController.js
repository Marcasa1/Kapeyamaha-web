const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    // Filtering, sorting, pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Brand filter
    if (req.query.brand) {
      query.brand = req.query.brand;
    }
    
    // Search
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } },
        { model: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // In stock only
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    
    // Featured products
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    
    // Execute query
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(req.query.sort || '-createdAt');
    
    // Pagination result
    const pagination = {};
    
    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination,
      data: products
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Increment view count
    product.viewCount += 1;
    await product.save();
    
    res.status(200).json({
      success: true,
      data: product
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: product
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    await product.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images
// @route   PUT /api/products/:id/images
// @access  Private/Admin
exports.uploadProductImages = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Handle multiple images
    const images = [];
    
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        
        // Upload to Cloudinary or save locally
        // This is a simplified version
        const imageUrl = `/uploads/products/${file.filename}`;
        
        images.push({
          url: imageUrl,
          alt: `${product.name} - Image ${i + 1}`,
          isPrimary: i === 0
        });
      }
    }
    
    // Update product images
    product.images = images;
    await product.save();
    
    res.status(200).json({
      success: true,
      data: product
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .limit(8)
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.category })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const relatedProducts = await Product.find({
      $or: [
        { category: product.category },
        { brand: product.brand },
        { tags: { $in: product.tags } }
      ],
      _id: { $ne: product._id }
    }).limit(4);
    
    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts
    });
    
  } catch (error) {
    next(error);
  }
};