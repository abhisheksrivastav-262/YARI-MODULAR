const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// POST /api/enquiry - Handle WhatsApp Cloud API Submission
app.post('/api/enquiry', async (req, res) => {
  const { name, phone, state, city, sourcePage } = req.body;

  if (!name || !phone || !state || !city) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Format the message
  const messageText = `New Website Enquiry — YARI MODULAR

Name: ${name}
Mobile Number: ${phone}
State: ${state}
City: ${city}
Source Page: ${sourcePage || 'Not specified'}`;

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const businessNumber = process.env.WHATSAPP_BUSINESS_NUMBER;

  if (!accessToken || !phoneNumberId || !businessNumber) {
    console.error('WhatsApp API credentials not fully configured.');
    return res.status(500).json({
      success: false,
      error: 'Unable to submit your enquiry right now. Please try again. (System Error: WhatsApp API not configured)'
    });
  }

  // Actual WhatsApp API integration using Facebook Graph API
  try {
    const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: businessNumber,
      type: 'text',
      text: {
        body: messageText
      }
    };

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(url, payload, { headers });
    
    console.log('WhatsApp API Response:', response.data);
    return res.status(200).json({ success: true, message: 'Enquiry sent via WhatsApp API.' });
  } catch (error) {
    console.error('WhatsApp API Error:', error.response ? error.response.data : error.message);
    // Even if it fails, we shouldn't necessarily crash the frontend, but we should return an error status
    return res.status(500).json({ error: 'Failed to send enquiry to WhatsApp.' });
  }
});

// Fallback to index.html for unknown routes
app.use((req, res) => {
  const file = req.path.split('/').pop();
  if (file && file.endsWith('.html')) {
      res.sendFile(path.join(__dirname, file));
  } else {
      res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Ready to receive enquiries at /api/enquiry');
});
