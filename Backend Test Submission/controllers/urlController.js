const urlDatabase = require("../models/urlModel");
const generateShortcode = require("../utils/generateShortcode");
const Log = require("../logger");
const validUrl = require("valid-url");

exports.createShortUrl = (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url || !validUrl.isUri(url)) {
    Log("backend", "error", "handler", "Invalid URL provided");
    return res.status(400).json({ error: "Invalid URL" });
  }

  let code = shortcode || generateShortcode();

  if (urlDatabase.some(e => e.shortcode === code)) {
    Log("backend", "warn", "handler", "Shortcode collision detected");
    return res.status(409).json({ error: "Shortcode already exists" });
  }

  const expiryMinutes = validity || 30;
  const expiryDate = new Date(Date.now() + expiryMinutes * 60000);

  const newEntry = {
    originalUrl: url,
    shortcode: code,
    createdAt: new Date(),
    expiry: expiryDate,
    clicks: []
  };

  urlDatabase.push(newEntry);

  Log("backend", "info", "repository", `Shortened URL created with code: ${code}`);

  return res.status(201).json({
    shortLink: `http://localhost:5000/${code}`,
    expiry: expiryDate.toISOString()
  });
};

exports.getStats = (req, res) => {
  const { shortcode } = req.params;
  const record = urlDatabase.find(e => e.shortcode === shortcode);

  if (!record) {
    Log("backend", "error", "handler", "Stats requested for non-existent shortcode");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  return res.json({
    shortLink: `http://localhost:5000/${record.shortcode}`,
    originalUrl: record.originalUrl,
    createdAt: record.createdAt,
    expiry: record.expiry,
    totalClicks: record.clicks.length,
    clickDetails: record.clicks
  });
};

exports.handleRedirect = (req, res) => {
  const { shortcode } = req.params;
  const record = urlDatabase.find(e => e.shortcode === shortcode);

  if (!record) {
    Log("backend", "error", "handler", "Redirection requested for unknown shortcode");
    return res.status(404).send("Shortcode not found");
  }

  if (new Date() > new Date(record.expiry)) {
    Log("backend", "warn", "handler", "Attempt to access expired link");
    return res.status(410).send("Link expired");
  }

  record.clicks.push({
    timestamp: new Date(),
    source: req.get("referrer") || "direct",
    location: "unknown"
  });

  Log("backend", "info", "controller", `Redirecting to original URL for ${shortcode}`);
  return res.redirect(record.originalUrl);
};
