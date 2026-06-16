import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_BOT_CHATID;

const bot = new TelegramBot(token, { polling: false });

async function sendNotification(file) {
    try {
        await bot.sendDocument(chatId, file, {
            caption: "Here is your daily automated report.",
            filename: "report.json"
        });
        console.log("message send successfully");
    } catch (error) {
        console.error("Telegram message send: ", error);
    }
}

export { sendNotification };
