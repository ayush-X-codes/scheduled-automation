import { fileURLToPath } from "url";
import { monitor } from "../services/monitor.js";
import { scrapeBooks } from "../services/scrapeBooks.js";
import fs from "fs";
import path from "path";
import { sendNotification } from "../services/notification.js";

async function runCompetitorMonitor() {
  try {
    await scrapeBooks();
    await monitor();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const resultPath = path.join(__dirname, "..", "/data/result.json");
    const fileStream = fs.createReadStream(resultPath);

    await sendNotification(fileStream);
  } catch (error) {
    console.error("running competitor monitor :", error);
  }
}

export { runCompetitorMonitor };
