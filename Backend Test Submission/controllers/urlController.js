const shortid = require('shortid');
const validUrl = require('valid-url');
const geoip = require('geoip-lite');
const urlDatabase = require('../data/db');
const appLogger = require('../middleware/logger');

// Controller function to shorten a URL
exports.shortenUrl = (req, res) => {
  const { longUrl, validity, shortcode } = req.body;

  // 1. Validate the long URL
  if (!validUrl.isUri(longUrl)) {
    appLogger('warn', 'controller', `Invalid longUrl received: ${longUrl}`);
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  // 2. Validate the validity period (must be a positive integer)
  if (validity && (!Number.isInteger(validity) || validity <= 0)) {
    appLogger('warn', 'controller', `Invalid validity received: ${validity}`);
    return res.status(400).json({ error: 'Validity must be a positive integer.' });
  }

  // 3. Validate and check uniqueness of the custom shortcode
  let finalShortcode = shortcode;
  if (finalShortcode) {
    if (!/^[a-zA-Z0-9_-]+$/.test(finalShortcode)) {
      appLogger('warn', 'controller', `Invalid characters in shortcode: ${finalShortcode}`);
      return res.status(400).json({ error: 'Shortcode can only contain letters, numbers, underscores, and hyphens.' });
    }
    if (urlDatabase[finalShortcode]) {
      appLogger('warn', 'controller', `Attempt to use existing shortcode: ${finalShortcode}`);
      return res.status(409).json({ error: 'This shortcode is already in use.' });
    }
  } else {
    finalShortcode = shortid.generate();
  }

  // 4. Calculate expiry timestamp
  const validityMinutes = validity || 30;
  const creationDate = new Date();
  const expiryDate = new Date(creationDate.getTime() + validityMinutes * 60000);

  // 5. Store the new URL data
  urlDatabase[finalShortcode] = {
    longUrl,
    shortUrl: `http://localhost:5000/${finalShortcode}`,
    creationDate,
    expiryDate,
    clicks: 0,
    clickData: []
  };

  appLogger('info', 'controller', `Successfully created shortcode ${finalShortcode} for ${longUrl}`);

  // 6. Return the response
  res.status(201).json({
    shortUrl: urlDatabase[finalShortcode].shortUrl,
    expiryTimestamp: expiryDate.toISOString()
  });
};

// Controller function to get statistics for a short URL
exports.getUrlStats = (req, res) => {
  const { shortcode } = req.params;
  const urlData = urlDatabase[shortcode];

  if (!urlData) {
    appLogger('warn', 'controller', `Stats requested for non-existent shortcode: ${shortcode}`);
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  appLogger('info', 'controller', `Stats retrieved for shortcode: ${shortcode}`);
  res.status(200).json({
    totalClicks: urlData.clicks,
    originalUrl: urlData.longUrl,
    creationDate: urlData.creationDate.toISOString(),
    expiryDate: urlData.expiryDate.toISOString(),
    clickHistory: urlData.clickData
  });
};

// Controller function to handle redirection
exports.redirectUrl = (req, res) => {
  const { shortcode } = req.params;
  const urlData = urlDatabase[shortcode];

  if (!urlData) {
    appLogger('warn', 'controller', `Redirect failed for non-existent shortcode: ${shortcode}`);
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  // Check if the URL has expired
  if (new Date() > urlData.expiryDate) {
    appLogger('info', 'controller', `Redirect failed for expired shortcode: ${shortcode}`);
    return res.status(410).json({ error: 'This link has expired.' });
  }

  // Track the click
  urlData.clicks++;
  const referrer = req.get('Referrer') || 'Direct';
  // Note: In a real-world scenario, req.ip might be behind a proxy.
  // You might need to check 'x-forwarded-for' header.
  const ip = req.ip;
  const geo = geoip.lookup(ip);
  const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown';

  urlData.clickData.push({
    timestamp: new Date().toISOString(),
    referrer,
    location
  });

  appLogger('info', 'controller', `Redirecting shortcode ${shortcode} to ${urlData.longUrl}`);
  
  // Perform the redirect
  res.redirect(urlData.longUrl);
};
