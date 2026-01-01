const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      featured,
      search,
      page = 1,
      limit = 12,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = brand;
    if (featured === 'true') filter.isFeatured = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    // Calculate discounted price if exists
    const productsWithDiscount = products.map(product => {
      const productObj = product.toObject();
      if (product.discountedPrice) {
        productObj.discountPercentage = Math.round(
          ((product.price - product.discountedPrice) / product.price) * 100
        );
      }
      return productObj;
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      products: productsWithDiscount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ],
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const productObj = product.toObject();
    if (product.discountedPrice) {
      productObj.discountPercentage = Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      );
    }

    res.status(200).json({
      success: true,
      product: productObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true
    }).limit(8);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        brands: { $addToSet: '$brand' }
      }},
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Admin: Create product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Admin: Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};