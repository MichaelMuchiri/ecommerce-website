import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">EcoShop</h3>
            <p className="footer-description">
              Your one-stop shop for quality products at amazing prices. 
              We provide the best shopping experience with secure payments 
              and fast delivery.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="Pinterest">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Customer Service</h4>
            <ul className="footer-links">
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/help">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Us</h4>
            <ul className="contact-info">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Commerce St, New York, NY 10001</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+1 (800) 123-4567</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>support@ecoshop.com</span>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="payment-methods">
              <i className="fab fa-cc-visa" title="Visa"></i>
              <i className="fab fa-cc-mastercard" title="Mastercard"></i>
              <i className="fab fa-cc-amex" title="American Express"></i>
              <i className="fab fa-cc-paypal" title="PayPal"></i>
              <i className="fab fa-cc-stripe" title="Stripe"></i>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4>Subscribe to Our Newsletter</h4>
          <p>Get the latest updates on new products and exclusive offers</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="copyright">
            © {currentYear} EcoShop. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;