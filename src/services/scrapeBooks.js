import * as cheerio from "cheerio";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const file = "/data/books.json";

let books = [];
let count;

async function scrapeBooks() {
  try {
    for (let i = 1; i < 51; i++) {
      const response = await fetch(
        `https://books.toscrape.com/catalogue/page-${i}.html`,
      );

      if (!response.ok) {
        throw new Error("Failed to get data from internet");
      }

      const html = await response.text();

      const $ = cheerio.load(html);

      $(".product_pod").each(async (i, el) => {
        const linkBook = $(el).find("h3 a").attr("href").trim();

        const completeBookUrl = `https://books.toscrape.com/catalogue/${linkBook}`;

        await getBookDetail(completeBookUrl);
      });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const timestamp = Date.now();
    const fileName = `data/books_${timestamp}.json`;

    const filePath = path.join(__dirname, "..", fileName);

    fs.writeFile(filePath, JSON.stringify(books, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("File written successfully!");
    });

    async function getBookDetail(link) {
      const res = await fetch(link);

      if (!res.ok) {
        throw new Error("Failed to get data from internet");
      }

      const html = await res.text();

      const $ = cheerio.load(html);

      const bookName = $(".product_main h1").text();

      const price = $(".product_main .price_color").text();

      const cleanPrice = Number(price.replace(/[^\d.]/g, ""));

      const availability = $(".product_main .availability").text().trim();

      const classAttr = $(".product_main .star-rating").attr("class");
      const rating = classAttr.split(" ")[1].trim();

      const review = $(".table").find("tr").last().find("td").last().text();
      const cleanReview = Number(review);

      const result = {
        name: bookName,
        price: cleanPrice,
        rating: rating,
        availability: availability,
        reviews: cleanReview,
      };

      books.push(result);
    }
  } catch (error) {
    console.error("An Error occurred: ", error);
  }
}

export { scrapeBooks };
