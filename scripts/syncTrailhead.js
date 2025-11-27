const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { exec } = require("child_process");

puppeteer.use(StealthPlugin());

const TRAILHEAD_URL = "https://trailblazer.me/id/sanketwalanj";
const SALESFORCE_ALIAS = "portfolio";

async function syncData() {
  console.log(`🧗 Launching Final Parser...`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--window-size=1920,1080"]
  });

  const page = await browser.newPage();

  try {
    await page.goto(TRAILHEAD_URL, {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    // 1. Click Cookie Button (Try-Catch)
    try {
      const cookieBtn = "#onetrust-accept-btn-handler";
      await page.waitForSelector(cookieBtn, { timeout: 3000 });
      await page.click(cookieBtn);
    } catch (e) {
      /* Ignore */
    }

    // 2. Get all text and split into clean lines
    const pageText = await page.evaluate(() => document.body.innerText);
    const lines = pageText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let badges = 0;
    let points = 0;
    let rank = "Mountaineer"; // Default from previous success

    // 3. "Line Walker" Logic
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      // Find Rank (If current line matches a known rank)
      if (
        [
          "ranger",
          "double star ranger",
          "mountaineer",
          "expeditioner",
          "scout"
        ].includes(line)
      ) {
        rank = lines[i]; // Use the original case
      }

      // Find Badges: If this line is "Badges", the PREVIOUS line is the number
      if (line === "badges" && i > 0) {
        const prevLine = lines[i - 1];
        if (/^[\d,]+$/.test(prevLine)) {
          // Check if previous line is a number
          badges = parseInt(prevLine.replace(/,/g, ""));
        }
      }

      // Find Points: If this line is "Points", the PREVIOUS line is the number
      if (line === "points" && i > 0) {
        const prevLine = lines[i - 1];
        if (/^[\d,]+$/.test(prevLine)) {
          points = parseInt(prevLine.replace(/,/g, ""));
        }
      }
    }

    console.log(
      `📊 Extracted -> Rank: ${rank}, Badges: ${badges}, Points: ${points}`
    );

    if (badges > 0) {
      console.log("💾 Updating Salesforce Org...");
      const updateCmd = `sf data record update --sobject Trailhead_Data__c --where "Name!=''" --values "Total_Badges__c=${badges} Total_Points__c=${points} Rank__c='${rank}'" --target-org ${SALESFORCE_ALIAS}`;

      exec(updateCmd, (uErr, uStdout, uStderr) => {
        if (uErr) console.error("❌ Update Failed:", uStderr);
        else console.log("🚀 Success! Salesforce record updated.");
      });
    } else {
      console.error("⚠️ Parser failed. The layout might be very different.");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
  }
}

syncData();
