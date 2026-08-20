// Karz and Dolls New Release Checker — ntfy.sh push notifications
// Run: node karzanddolls.js

const PAGES = [
  {
    url: "https://www.karzanddolls.com/details/mini+gt+/mini-gt/MTY1?page=1",
    name: "Mini GT Page 1"
  }
];

const KEYWORDS = [
  "MINI GT 1170",
  "MINI GT 1218",
  "MINI GT 1224",
  "MINI GT 1215",
];

const INTERVAL_MS = 30000;
const NTFY_TOPIC = "vineet-hotwheels-alert";

async function sendPush(keyword, url) {
  await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: "POST",
    body: `New release spotted! "${keyword}" found on ${url}`,
    headers: { "Title": "New Mini GT Release!", "Priority": "urgent", "Tags": "car,rotating_light" }
  });
}

async function checkPage(page) {
  try {
    const res = await fetch(page.url, { cache: "no-store" });
    const html = await res.text();

    for (const keyword of KEYWORDS) {
      if (html.toLowerCase().includes(keyword.toLowerCase())) {
        console.log(`FOUND: "${keyword}" on ${page.name}! Sending notification...`);
        await sendPush(keyword, page.url);
        return; // Stop checking once found
      }
    }

    console.log(new Date().toLocaleTimeString(), `- Not found yet on ${page.name}`);

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
