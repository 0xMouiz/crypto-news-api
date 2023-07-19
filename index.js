const PORT = process.env.PORT || 8080;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newsArticles = [
  // {
  //   name: "techcrunch",
  //   address: "https://techcrunch.com/category/cryptocurrency/",
  //   base: "", // in case the URL is not completed
  // },
  {
    name: "coingecko",
    address: "https://www.coingecko.com/en/news",
    base: "",
  },
];

// prettier-ignore
const keywords = 'a:contains("crypto"), a:contains("Crypto"), a:contains("cryptocurrency"), a:contains("Cryptocurrency"), a:contains("web3"), a:contains("Web3"), a:contains("blockchain"), a:contains("Blockchain"), a:contains("bitcoin"), a:contains("Bitcoin"), a:contains("ethereum"), a:contains("Ethereum"), a:contains("binance"), a:contains("Binance"), a:contains("coinbase"), a:contains("Coinbase"), a:contains("SEC"), a:contains("xrp"),  a:contains("XRP"), a:contains("ripple"), a:contains("Ripple"), a:contains("solana"), a:contains("Solana"), a:contains("shiba"), a:contains("Shiba"), a:contains("coin"), a:contains("AI"), a:contains("invest"), a:contains("trade"), a:contains("trading"), a:contains("investing"), a:contains("market"), a:contains("decentralized"), a:contains("ICO"), a:contains("wallet"), a:contains("smart contract"), a:contains("exchange"), a:contains("DeFi"), a:contains("DApp"), a:contains("stake"), a:contains("CZ"), a:contains("whales"), a:contains("Bull market"), a:contains("bull market"), a:contains("Bear market"), a:contains("bear market")'

// ...

let articles = [];
// Function to fetch articles and populate the articles array
const fetchArticles = async () => {
  articles = [];

  for await (const newsArticle of newsArticles) {
    let sourceArticles = []; // Separate array for each source

    await axios
      .get(newsArticle.address)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        let imageUrl;

        $("a")
          .filter(function () {
            return $(this).closest("h2").length > 0;
          })
          .each(function (index) {
            const title = $(this).text();
            const url = $(this).attr("href");

            const articleElement = $(this)
              .closest("h2")
              .parent()
              .parent()
              .parent();
            const img = articleElement.find("img");
            const imageUrl = img.attr("src");

            // const payload = {
            //   title,
            //   imageUrl,
            //   url: newsArticle.base + url,
            //   source: newsArticle.name,
            // };

            // const doubled = articles.find(
            //   (element) => JSON.stringify(element) === JSON.stringify(payload)
            // );
            // if (doubled) {
            //   return;
            // }

            // articles.push(payload);

            articles.push({
              title,
              imageUrl,
              url: newsArticle.base + url,
              source: newsArticle.name,
            });
          });
      })
      .catch((error) => console.log(error));
  }
};

// ...

app.get("/", (req, res, next) => {
  return res.send("nice");
});

app.get("/api/news", async (req, res, next) => {
  await fetchArticles();

  return res.json(articles);
});

app.listen(PORT, () => {
  console.log("Server running...");
});

module.exports = app;

// const fetchArticles = async () => {
//   for await (const newsArticle of newsArticles) {
//     await axios
//       .get(newsArticle.address)
//       .then((response) => {
//         const html = response.data;
//         const $ = cheerio.load(html);
//         let imageUrl;

//         $("a", html).each(function (index) {
//           const title = $(this).text();
//           const url = $(this).attr("href");

//           if (
//             newsArticle.address ===
//             "https://techcrunch.com/category/cryptocurrency/"
//           ) {
//             const articleElements = $(".post-block");
//             const articleElement = articleElements.eq(index);
//             const img = articleElement.find("footer img");
//             imageUrl = img.attr("src");
//           }
//           const payload = {
//             title,
//             imageUrl,
//             url: newsArticle.base + url,
//             source: newsArticle.name,
//           };

//           const doubled = articles.find((element) => element === payload);
//           if (doubled) {
//             return;
//           }
//           articles.push(payload);
//         });
//       })
//       .catch((error) => console.log(error));
//   }
//   return articles;
// };
