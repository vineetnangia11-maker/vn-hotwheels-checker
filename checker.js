// Hot Wheels Stock Checker — ntfy.sh push notifications
// Run: node checker.js

const PRODUCTS = [
  {
    url: "https://www.firstcry.com/hot-wheels/hot-wheels-free-wheel-die-cast-boulevard-vehicle-koenigsegg-cc850-toy-car-silver/23029347/product-detail?ref=ios_share",
    name: "Koenigsegg CC850",
    productId: "23029347"
  },
  {
    url: "https://www.firstcry.com/hot-wheels/hot-wheels-boulevard-vehicle-mercedes-benz-clk-63-amg-black-series-premium-1-64-scale-car-toy-for-collectors/21134317/product-detail?ref=ios_share",
    name: "Mercedes CLK AMG",
    productId: "21134317"
  }
];

const INTERVAL_MS = 30000;
const NTFY_TOPIC = "vineet-hotwheels-alert";

async function sendPush(productName, url) {
  await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: "POST",
    body: `${productName} is in stock now! ${url}`,
    headers: { "Title": "Hot Wheels In Stock!", "Priority": "urgent", "Tags": "car,rotating_light" }
  });
}

async function checkStock(product) {
  try {
    const res = await fetch(product.url, { cache: "no-store" });
    const html = await res.text();

    // Extract CurSt value for this product from the page data
    const match = html.match(/"pid":` + "`" + `${product.productId}` + "`" + `.*?"CurSt":(\d+)/s) ||
                  html.match(new RegExp(`"CurSt":(\\d+).*?"pid":${product.productId}`, 's'));

    // Simpler approach - find CurSt in the PInfo section
    const curStMatch = html.match(/"CurSt":(\d+)/);
    const curSt = curStMatch ? parseInt(curStMatch[1]) : 0;

    if (curSt > 0) {
      console.log(`IN STOCK: ${product.name} (CurSt=${curSt})! Sending push notification...`);
      await sendPush(product.name, product.url);
    } else {
      console.log(new Date().toLocaleTimeString(), `- Not in stock yet: ${product.name} (CurSt=${curSt})`);
    }
  } catch (e) {
    console.error(`Error checking ${product.name}:`, e.message);
  }
}

async function checkAll() {
  for (const product of PRODUCTS) {
    await checkStock(product);
  }
}

console.log("Checker running every 30 seconds...");
checkAll();
setInterval(checkAll, INTERVAL_MS);
