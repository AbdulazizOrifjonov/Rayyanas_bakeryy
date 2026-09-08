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
    
    const botToken = process.env.VITE_BOT_TOKEN || '8849500819:AAH74freLw2W5Nnpf9q9h1swajxncs5QZIs';
    const adminId = process.env.VITE_ADMIN_ID || '1594150529';
    
    if (!botToken || !adminId) {
      return res.status(500).json({ error: 'Missing environment variables' });
    }

    const itemsHtml = Array.isArray(orderDetails.items) 
      ? orderDetails.items.map(item => {
          if (typeof item === 'string') return `▪️ ${item}`;
          return `▪️ ${item.name} — ${item.quantity} ta`;
        }).join('\n')
      : orderDetails.items;

    const message = `
🆕 <b>YANGI BUYURTMA</b>

👤 <b>Mijoz:</b> ${userDetails.firstName} ${userDetails.lastName || ''} ${userDetails.username ? `(@${userDetails.username})` : ''}
📞 <b>Telefon:</b> ${orderDetails.phone}

🛒 <b>Mahsulotlar:</b>
${itemsHtml}

💬 <b>Izoh:</b> ${orderDetails.comments || 'yo\'q'}

💰 <b>Umumiy summa:</b> ${orderDetails.total.toLocaleString('uz-UZ')} so'm

📍 <b>Manzil:</b>
${orderDetails.addressText}
${orderDetails.mapLink ? `\n🗺 <b>Xaritada ko'rish:</b>\n<a href="${orderDetails.mapLink}">${orderDetails.mapLink}</a>` : ''}
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

    // Now send the product photos
    if (Array.isArray(orderDetails.items)) {
      for (const item of orderDetails.items) {
        if (item.image_url) {
          try {
            const replyMarkup = {
              inline_keyboard: [[
                {
                  text: `Ochish (Mini App)`,
                  url: `https://t.me/RayyanasBakery_bot/app?startapp=${item.id}`
                }
              ]]
            };

            if (item.image_url.startsWith('data:image')) {
              const [header, base64Data] = item.image_url.split(',');
              const mimeMatch = header.match(/:(.*?);/);
              const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
              const buffer = Buffer.from(base64Data, 'base64');
              const blob = new Blob([buffer], { type: mime });

              const fd = new FormData();
              fd.append('chat_id', adminId);
              fd.append('document', blob, 'product.jpg');
              fd.append('caption', `📦 <b>${item.name}</b>\nSoni: ${item.quantity} ta`);
              fd.append('parse_mode', 'HTML');
              fd.append('reply_markup', JSON.stringify(replyMarkup));

              await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                method: 'POST',
                body: fd
              });
            } else {
              await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: adminId,
                  document: item.image_url,
                  caption: `📦 <b>${item.name}</b>\nSoni: ${item.quantity} ta`,
                  parse_mode: 'HTML',
                  reply_markup: replyMarkup
                })
              });
            }
          } catch (e) {
            console.error('Failed to send photo for', item.name, e);
          }
        }
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram notification error:', error);
    return res.status(500).json({ error: error.message });
  }
}
