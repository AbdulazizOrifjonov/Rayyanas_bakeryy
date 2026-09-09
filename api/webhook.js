export default async function handler(req, res) {
  if (req.method === 'POST') {
    const update = req.body;
    
    if (update.message && update.message.text) {
      const text = update.message.text;
      const chatId = update.message.chat.id;
      const botToken = process.env.VITE_BOT_TOKEN || '8849500819:AAH74freLw2W5Nnpf9q9h1swajxncs5QZIs';

      if (text.startsWith('/start')) {
        let message = "Xush kelibsiz! Rayyanas Bakery onlayn do'koniga kirish uchun quyidagi tugmani bosing:";
        let buttonText = "🛒 Online do'konga o'tish";
        let webAppUrl = "https://rayyanas-bakeryy.vercel.app/";

        if (text === '/start admin') {
          message = "Admin Panelga xush kelibsiz! Buyurtmalarni boshqarish uchun tugmani bosing:";
          buttonText = "⚙️ Admin Panelni Ochish";
          webAppUrl = "https://rayyanas-bakeryy.vercel.app/admin?tab=orders";
        }

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            reply_markup: {
              inline_keyboard: [[
                {
                  text: buttonText,
                  web_app: { url: webAppUrl }
                }
              ]]
            }
          })
        });
      }
    }
    
    return res.status(200).json({ ok: true });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
