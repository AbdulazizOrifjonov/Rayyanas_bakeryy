fetch('https://rayyanas-bakeryy.vercel.app/api/notify-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ telegramId: '1594150529', status: 'accepted' })
}).then(res => res.text()).then(console.log).catch(console.error);
