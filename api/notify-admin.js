export default async function handler(req, res) {
  // CORS configuration if needed
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderDetails, userDetails } = req.body;
    
    const botToken = process.env.VITE_BOT_TOKEN; // Or just BOT_TOKEN in Vercel
    const adminId = process.env.VITE_ADMIN_ID;   // Or just ADMIN_ID
    
    if (!botToken || !adminId) {
      return res.status(500).json({ error: 'Missing environment variables' });
    }

    const message = `
🆕 <b>YANGI BUYURTMA</b>

👤 Mijoz: ${userDetails.firstName} ${userDetails.lastName || ''}
📱 Telefon: ${orderDetails.phone}
📍 Manzil: ${orderDetails.address}
💬 Izoh: ${orderDetails.comments || '-'}

💰 Umumiy summa: <b>${orderDetails.total.toLocaleString('uz-UZ')} so'm</b>

Username: @${userDetails.username || 'yoq'}
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram notification error:', error);
    return res.status(500).json({ error: error.message });
  }
}
