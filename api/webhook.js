export default async function handler(req, res) {
  if (req.method === 'POST') {
    const update = req.body;
    
    if (update.message && update.message.text === '/start') {
      const chatId = update.message.chat.id;
      const botToken = process.env.VITE_BOT_TOKEN;
      
      const message = "Xush kelibsiz! Rayyanas Bakery onlayn do'koniga kirish uchun quyidagi tugmani bosing:";
      
      await fetch(https://api.telegram.org/bot + botToken + /sendMessage, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          reply_markup: {
            inline_keyboard: [[
              {
                text: "🛒 Online do'konga o'tish",
                web_app: { url: "https://rayyanas-bakeryy.vercel.app/" }
              }
            ]]
          }
        })
      });
    }
    
    return res.status(200).json({ ok: true });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
