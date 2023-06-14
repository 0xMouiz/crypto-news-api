const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

const newsArticles = [
  {
    name: "techcrunch",
    address: "https://techcrunch.com/category/cryptocurrency/",
    base: "", // in case the URL is not completed
  },
];

// prettier-ignore
const keywords = 'a:contains("crypto"), a:contains("web3"), a:contains("blockchain"), a:contains("bitcoin"), a:contains("ethereum"), a:contains("binance"), a:contains("coinbase"), a:contains("sec"), a:contains("xrp"), a:contains("ripple"), a:contains("solana"), a:contains("coin")'

const articles = [];

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

router.get("/news", (req, res, next) => {
  res.json(articles);
});

module.exports = router;
