const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Route to create a new shortened URL
// POST /shorturls
router.post('/shorturls', urlController.shortenUrl);

// Route to get statistics for a shortened URL
// GET /shorturls/:shortcode
router.get('/shorturls/:shortcode', urlController.getUrlStats);

// Route to redirect to the original URL
// GET /:shortcode
router.get('/:shortcode', urlController.redirectUrl);

module.exports = router;
