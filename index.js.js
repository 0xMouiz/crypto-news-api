const PORT = process.env.PORT || 8080;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newsArticles = [
  {
    name: "techcrunch",
    address: "https://techcrunch.com/category/cryptocurrency/",
    base: "", // in case the URL is not completed
  },
];

// prettier-ignore
const keywords = 'a:contains("crypto"), a:contains("web3"), a:contains("blockchain"), a:contains("bitcoin"), a:contains("ethereum"), a:contains("binance"), a:contains("coinbase"), a:contains("sec"), a:contains("xrp"), a:contains("ripple"), a:contains("solana"), a:contains("coin")';

let articles = [];

// Function to fetch articles and populate the articles array
const fetchArticles = () => {
  newsArticles.forEach((newsArticle) => {
    axios.get(newsArticle.address).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      let imageUrl;

      $(keywords, html).each(function (index) {
        const title = $(this).text();
        const url = $(this).attr("href");

        if (
          newsArticle.address ===
          "https://techcrunch.com/category/cryptocurrency/"
        ) {
          const articleElements = $(".post-block");
          const articleElement = articleElements.eq(index);
          const img = articleElement.find("footer img");
          imageUrl = img.attr("src");
        }

        articles.push({
          title,
          imageUrl,
          url: newsArticle.base + url,
          source: newsArticle.name,
        });
      });
    });
  });
};

// Call the fetchArticles function to populate the articles array
fetchArticles();

app.get("/", (req, res, next) => {
  res.json(articles);
});

app.listen(PORT, () => {
  console.log("Server running...");
});
