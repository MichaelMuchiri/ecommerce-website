const axios = require('axios');
const crypto = require('crypto');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.passkey = process.env.MPESA_PASSKEY;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    
    this.baseURL = this.environment === 'production' 
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  // Get OAuth Token
  async getAuthToken() {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    
    try {
      const response = await axios.get(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa Auth Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generate password for STK push
  generatePassword() {
    const timestamp = this.getTimestamp();
    const passwordStr = `${this.shortcode}${this.passkey}${timestamp}`;
    const password = Buffer.from(passwordStr).toString('base64');
    return { password, timestamp };
  }

  // Get current timestamp
  getTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  // Initiate STK Push (Lipa Na M-Pesa Online)
  async stkPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      const token = await this.getAuthToken();
      const { password, timestamp } = this.generatePassword();
      
      // Format phone number (remove 0 or +254)
      let formattedPhone = phoneNumber.toString();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.substring(1);
      }
      
      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/mpesa-callback`,
        AccountReference: accountReference || 'EcoShop Payment',
        TransactionDesc: transactionDesc || 'Payment for order'
      };
      
      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('M-Pesa STK Push Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Query transaction status
  async queryStatus(checkoutRequestID) {
    try {
      const token = await this.getAuthToken();
      const { password, timestamp } = this.generatePassword();
      
      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };
      
      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('M-Pesa Query Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new MpesaService();