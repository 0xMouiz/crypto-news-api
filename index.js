const PORT = process.env.PORT || 8080;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newsRoute = require("./routes/news");

app.get("/", (req, res, next) => {
  res.json("Welcome to my Crypto News API!");
});

app.use("/", newsRoute);

app.listen(PORT, () => {
  console.log("Server running...");
});
