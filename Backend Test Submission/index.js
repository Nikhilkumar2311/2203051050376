const express = require("express");
const app = express();
const urlRoutes = require("./routes/urlRoutes");
const Log = require("./logger");

app.use(express.json());

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

Log("backend", "info", "service", "Starting URL Shortener Backend");

app.use("/", urlRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  Log("backend", "info", "service", `Server running on port ${PORT}`);
});
