const { Cart, Product } = require('../models');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price images quantity slug'
      });

    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} items available in stock`
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart if none exists
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && 
             (item.variant || null) === (variant || null)
    );

    const itemPrice = product.price;
    const itemTotal = itemPrice * quantity;

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Check stock again for total quantity
      if (product.quantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more. Only ${product.quantity - cart.items[existingItemIndex].quantity} available`
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].total = itemPrice * newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        variant,
        quantity,
        price: itemPrice,
        total: itemTotal
      });
    }

    // Save cart (triggers pre-save hook to calculate totals)
    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price images quantity slug'
    });

    res.json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find the item
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check product stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} items available in stock`
      });
    }

    // Update quantity and total
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].total = cart.items[itemIndex].price * quantity;

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price images quantity slug'
    });

    res.json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item
    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price images quantity slug'
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // TODO: Implement coupon validation logic
    // For now, just set the coupon code
    cart.couponCode = couponCode;
    await cart.save();

    res.json({
      success: true,
      message: 'Coupon applied',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to apply coupon',
      error: error.message
    });
  }
};

// @desc    Merge guest cart with user cart after login
// @route   POST /api/cart/merge
// @access  Private
const mergeCart = async (req, res) => {
  try {
    const { guestCart } = req.body;

    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      return res.json({
        success: true,
        message: 'No items to merge'
      });
    }

    let userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      userCart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        item => item.product.toString() === guestItem.product._id
      );

      if (existingItemIndex > -1) {
        // Add quantities if item exists
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
        userCart.items[existingItemIndex].total = 
          userCart.items[existingItemIndex].price * userCart.items[existingItemIndex].quantity;
      } else {
        // Add new item
        userCart.items.push({
          product: guestItem.product._id,
          quantity: guestItem.quantity,
          price: guestItem.price,
          total: guestItem.price * guestItem.quantity
        });
      }
    }

    await userCart.save();

    await userCart.populate({
      path: 'items.product',
      select: 'name price images quantity slug'
    });

    res.json({
      success: true,
      message: 'Cart merged successfully',
      data: userCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to merge cart',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  mergeCart
};