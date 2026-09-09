export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { telegramId, status } = req.body;
    if (!telegramId || !status || status === 'new') {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const messages = {
      'accepted': '✅ <b>Buyurtmangiz qabul qilindi!</b>\n\nTez orada tayyorlashni boshlaymiz. Bizni tanlaganingiz uchun rahmat! 😊',
      'preparing': '👨‍🍳 <b>Buyurtmangiz tayyorlanmoqda!</b>\n\nEng shirin mahsulotlar aynan siz uchun mehr bilan tayyorlanyapti! 🧁',
      'delivering': '🚚 <b>Buyurtmangiz yo\'lga chiqdi!</b>\n\nKuryerimiz siz tomonga harakatlanmoqda. Iltimos, telefoningizni aloqada saqlang! 📱',
      'completed': '🎉 <b>Buyurtmangiz yetkazib berildi!</b>\n\nYoqimli ishtaha! Yana buyurtma berishingizni kutib qolamiz! ❤️',
      'cancelled': '❌ <b>Buyurtmangiz bekor qilindi.</b>\n\nKeltirilgan noqulayliklar uchun uzr so\'raymiz. Savollaringiz bo\'lsa admin bilan bog\'lanishingiz mumkin.'
    };

    const message = messages[status];
    if (!message) return res.status(400).json({ error: 'Invalid status' });

    const botToken = process.env.VITE_BOT_TOKEN || '8849500819:AAH74freLw2W5Nnpf9q9h1swajxncs5QZIs';
    if (!botToken) return res.status(500).json({ error: 'Bot token missing on server' });

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text: `🔔 <b>Hurmatli mijoz!</b>\n\n${message}`,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    if (!result.ok) {
      console.error('Telegram API error:', result);
      return res.status(400).json({ error: result.description });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Notify user error:', error);
    return res.status(500).json({ error: error.message });
  }
}
