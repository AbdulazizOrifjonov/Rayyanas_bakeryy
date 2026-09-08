const botToken = process.env.VITE_BOT_TOKEN;
const webhookUrl = 'https://rayyanas-bakeryy.vercel.app/api/webhook';

async function run() {
  const res = await fetch('https://api.telegram.org/bot' + botToken + '/setWebhook?url=' + webhookUrl);
  const data = await res.json();
  console.log(data);
}
run();
