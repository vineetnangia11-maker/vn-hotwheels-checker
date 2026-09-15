// Karz and Dolls New Release Checker — ntfy.sh push notifications
// Run: node karzanddolls.js

const PAGES = [
  {
    url: "https://www.karzanddolls.com/mini-gt/mini-gt",
    name: "Mini GT Page"
  }
];

const KEYWORDS = [
  "MINI GT 1170",
  "MINI GT 1218",
  "MINI GT 1224",
  "MINI GT 1215",
  "MINI GT 853",
  
];

const INTERVAL_MS = 15000;
const NTFY_TOPIC = "vineet-hotwheels-alert";

async function sendPush(keyword, url) {
  await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: "POST",
    body: `New release spotted! "${keyword}" found on Karz and Dolls! ${url}`,
    headers: { "Title": "New Mini GT Release!", "Priority": "urgent", "Tags": "car,rotating_light" }
  });
}

async function checkPage(page) {
  try {
    const res = await fetch(page.url, { cache: "no-store" });
    const html = await res.text();

    for (const keyword of KEYWORDS) {
      if (html.includes(keyword)) {
        console.log(`FOUND: "${keyword}" on ${page.name}! Sending notification...`);
        await sendPush(keyword, page.url);
        return;
      }
    }

    console.log(new Date().toLocaleTimeString(), `- Keywords not found yet on ${page.name}`);

  } catch (e) {
    console.error(`Error checking ${page.name}:`, e.message);
  }
}

async function checkAll() {
  for (const page of PAGES) {
    await checkPage(page);
  }
}

console.log("Karz and Dolls checker running every 30 seconds...");
checkAll();
setInterval(checkAll, INTERVAL_MS);
