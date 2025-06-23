import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const createShortUrl = (payload) =>
  axios.post(`${BASE_URL}/shorturls`, payload);

export const getStats = (shortcode) =>
  axios.get(`${BASE_URL}/shorturls/${shortcode}`);
