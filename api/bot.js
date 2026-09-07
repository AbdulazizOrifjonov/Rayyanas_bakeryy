export default async function handler(req, res) {
  if (req.method === 'POST') {
    const message = req.body.message;
    if (message && message.text === '/start') {
      const chatId = message.chat.id;
      const botToken = process.env.VITE_BOT_TOKEN;
      const webAppUrl = 'https://rayyanas-bakeryy.vercel.app';
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Assalomu alaykum! Rayyanas Bakery online do\'koniga xush kelibsiz. \n\nPastdagi tugmani bosib do\'konga kiring:',
          reply_markup: {
            inline_keyboard: [[
              { text: '🎂 Do\'konga kirish', web_app: { url: webAppUrl } }
            ]]
          }
        })
      });
    }
    return res.status(200).json({ status: 'ok' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
