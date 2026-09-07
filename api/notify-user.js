export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { telegramId, status, orderId } = req.body;
    const botToken = process.env.VITE_BOT_TOKEN || '8849500819:AAH74freLw2W5Nnpf9q9h1swajxncs5QZIs';
    
    if (!botToken || !telegramId) {
      return res.status(500).json({ error: 'Missing credentials' });
    }

    const statusMap = {
      'accepted': '✅ Qabul qilindi',
      'preparing': '👨🍳 Tayyorlanmoqda',
      'delivering': '🚗 Yetkazilmoqda',
      'completed': '🎉 Bajarildi (Yetkazib berildi)',
      'cancelled': '❌ Bekor qilindi'
    };

    const statusText = statusMap[status] || status;

    const message = `
📦 <b>Buyurtma holati o'zgardi!</b> (Buyurtma #${orderId})

Yangi holat: <b>${statusText}</b>

Sizning buyurtmangiz ustida ishlanmoqda. Bizni tanlaganingiz uchun rahmat!
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.description);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('User notification error:', error);
    return res.status(500).json({ error: error.message });
  }
}
