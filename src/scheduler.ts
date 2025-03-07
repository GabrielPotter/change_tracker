import schedule from "node-schedule";
import { config } from "./config";
import { main } from "./index";

const daysMap: Record<string, number> = {
  "sunday": 0,
  "monday": 1,
  "tuesday": 2,
  "wednesday": 3,
  "thursday": 4,
  "friday": 5,
  "saturday": 6
};

// 📌 Ellenőrizzük, hogy ma kell-e futnia a programnak
function shouldRunToday(): boolean {
  const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday

  if (config.schedule.days === "everyday") {
    return true;
  }

  if (config.schedule.days === "workday" && today >= 1 && today <= 5) {
    return true;
  }

  if (Array.isArray(config.schedule.days) && config.schedule.days.some((day: string) => daysMap[day.toLowerCase()] === today)) {
    return true;
  }

  return false;
}

// 📌 Időzített feladatok beállítása
export function scheduleTasks() {
  if (!shouldRunToday()) {
    console.log("⏳ Today is not a scheduled day. Skipping execution.");
    return;
  }

  for (const time of config.schedule.times) {
    const [hour, minute] = time.split(":").map(Number);

    schedule.scheduleJob({ hour, minute }, () => {
      console.log(`🚀 Running scheduled task at ${time}`);
      main().catch(console.error);
    });

    console.log(`📅 Scheduled task for ${time}`);
  }
}
