const botToken = process.env.VITE_BOT_TOKEN;
async function run() {
  const res = await fetch('https://api.telegram.org/bot' + botToken + '/getUpdates');
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
