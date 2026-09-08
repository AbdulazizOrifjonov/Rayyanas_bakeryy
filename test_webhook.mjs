import handler from './api/webhook.js';
const req = { method: 'GET' };
const res = { status: (c) => ({ json: (d) => console.log(c, d) }) };
handler(req, res).catch(console.error);
