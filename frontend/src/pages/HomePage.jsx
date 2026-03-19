import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import './HomePage.css';

const HomePage = () => {
  const { 
    featuredProducts, 
    topProducts, 
    loading, 
    fetchFeaturedProducts, 
    fetchTopProducts,
    fetchCategories 
  } = useProducts();
  
  const { user } = useAuth();
  const { itemCount } = useCart();
  
  const [email, setEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Categories data
  const categories = [
    { id: 1, name: 'Electronics', icon: 'fas fa-laptop', color: '#3498db' },
    { id: 2, name: 'Fashion', icon: 'fas fa-tshirt', color: '#e74c3c' },
    { id: 3, name: 'Home & Living', icon: 'fas fa-home', color: '#2ecc71' },
    { id: 4, name: 'Sports', icon: 'fas fa-futbol', color: '#f39c12' },
    { id: 5, name: 'Books', icon: 'fas fa-book', color: '#9b59b6' },
    { id: 6, name: 'Toys', icon: 'fas fa-gamepad', color: '#e67e22' },
    { id: 7, name: 'Beauty', icon: 'fas fa-spa', color: '#fd79a8' },
    { id: 8, name: 'Automotive', icon: 'fas fa-car', color: '#34495e' }
  ];

  // Benefits data
  const benefits = [
    { 
      icon: 'fas fa-truck', 
      title: 'Free Shipping', 
      description: 'On orders over $50' 
    },
    { 
      icon: 'fas fa-undo', 
      title: '30-Day Returns', 
      description: 'Hassle-free returns' 
    },
    { 
      icon: 'fas fa-lock', 
      title: 'Secure Payment', 
      description: '100% secure transactions' 
    },
    { 
      icon: 'fas fa-headset', 
      title: '24/7 Support', 
      description: 'Dedicated customer service' 
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 5,
      comment: 'Amazing shopping experience! Fast delivery and excellent product quality.',
      date: '2 days ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'MC',
      rating: 5,
      comment: 'Best prices I could find anywhere. Will definitely shop here again!',
      date: '1 week ago'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'ER',
      rating: 4,
      comment: 'Great customer service. They helped me with my order questions immediately.',
      date: '2 weeks ago'
    }
  ];

  useEffect(() => {
    // Fetch data on component mount
    fetchFeaturedProducts();
    fetchTopProducts();
    fetchCategories();

    // Show welcome message for new users
    if (user && !localStorage.getItem('welcomeShown')) {
      setShowWelcome(true);
      localStorage.setItem('welcomeShown', 'true');
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [fetchFeaturedProducts, fetchTopProducts, fetchCategories, user]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send to your API
      setNewsletterSubscribed(true);
      setEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 3000);
    }
  };

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i 
        key={index} 
        className={`fas fa-star ${index < rating ? 'filled' : ''}`}
      ></i>
    ));
  };

  return (
    <>
      <MetaTags 
        title="Home"
        description="Shop the best products at amazing prices. Discover thousands of items with fast shipping and secure payment."
        keywords="ecommerce, shop, online shopping, deals, discounts"
      />
      
      <SchemaMarkup type="WebSite" />

      <div className="home-page">
        {/* Welcome Toast */}
        {showWelcome && (
          <div className="welcome-toast">
            <div className="toast-content">
              <i className="fas fa-smile"></i>
              <div>
                <h4>Welcome back, {user?.name}!</h4>
                <p>You have {itemCount} items in your cart</p>
              </div>
            </div>
            <button onClick={() => setShowWelcome(false)}>×</button>
          </div>
        )}

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">Summer Sale</span>
            <h1>Welcome to EcoShop</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <div className="hero-buttons">
              <Link to="/shop" className="shop-now-btn">
                Shop Now <i className="fas fa-arrow-right"></i>
              </Link>
              <button 
                className="learn-more-btn"
                onClick={() => handleScrollToSection('featured')}
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">
                  <i className={benefit.icon}></i>
                </div>
                <div className="benefit-content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section id="featured" className="featured-section">
          <div className="section-header">
            <div>
              <h2>Featured Products</h2>
              <p className="section-subtitle">Hand-picked just for you</p>
            </div>
            <Link to="/shop?filter=featured" className="view-all">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.slice(0, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="section-header centered">
            <h2>Shop by Category</h2>
            <p className="section-subtitle">Browse our wide range of categories</p>
          </div>
          
          <div className="category-grid">
            {categories.map(category => (
              <Link 
                to={`/shop?category=${category.name.toLowerCase()}`} 
                key={category.id} 
                className="category-card"
                style={{ '--category-color': category.color }}
              >
                <div className="category-icon">
                  <i className={category.icon}></i>
                </div>
                <span className="category-name">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="promo-banner">
          <div className="promo-content">
            <h3>Limited Time Offer</h3>
            <h2>Up to 50% Off</h2>
            <p>On selected items. Hurry, offer ends soon!</p>
            <div className="countdown">
              <div className="countdown-item">
                <span className="countdown-number">02</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">12</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">45</span>
                <span className="countdown-label">Mins</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">30</span>
                <span className="countdown-label">Secs</span>
              </div>
            </div>
            <Link to="/shop" className="shop-now-btn">
              Shop the Sale
            </Link>
          </div>
        </section>

        {/* Top Rated Products */}
        <section className="top-rated-section">
          <div className="section-header">
            <div>
              <h2>Top Rated Products</h2>
              <p className="section-subtitle">Our customers' favorites</p>
            </div>
            <Link to="/shop?sort=rating" className="view-all">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="product-grid">
              {topProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="section-header centered">
            <h2>What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from real customers</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <span className="review-date">{testimonial.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <div className="newsletter-content">
            <i className="fas fa-envelope-open-text newsletter-icon"></i>
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest updates on new products and upcoming sales</p>
            
            {newsletterSubscribed ? (
              <div className="subscription-success">
                <i className="fas fa-check-circle"></i>
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <div className="form-group">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">
                    Subscribe <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
                <p className="privacy-note">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Brands Section */}
        <section className="brands-section">
          <div className="brands-grid">
            <div className="brand-item">Nike</div>
            <div className="brand-item">Adidas</div>
            <div className="brand-item">Apple</div>
            <div className="brand-item">Samsung</div>
            <div className="brand-item">Sony</div>
            <div className="brand-item">LG</div>
          </div>
        </section>

        {/* Scroll to Top Button */}
        <button 
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      </div>
    </>
  );
};

export default HomePage;