const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const WebSocket = require('ws');
console.log("Connecting to WebSocket with ipv4first...");
const ws = new WebSocket('wss://ep-damp-breeze-avvcq12j-pooler.c-11.us-east-1.aws.neon.tech/v2');

ws.on('open', () => {
  console.log("WebSocket connected successfully!");
  ws.close();
});

ws.on('error', (err) => {
  console.error("WebSocket error:", err);
});
