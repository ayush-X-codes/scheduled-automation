import cron from "node-cron";
import { runCompetitorMonitor } from "../workflow/runCompetitorMonitor.js";

function dailyReportScheduler() {
    cron.schedule("* * * * *", runCompetitorMonitor);
}

export { dailyReportScheduler };
