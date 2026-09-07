# Rayyanas Bakery - Telegram Mini App

Ushbu loyiha React, Vite, Tailwind CSS va Supabase yordamida yozilgan Telegram Mini App (Web App) hisoblanadi. 
Backend uchun to'g'ridan-to'g'ri Supabase va Telegram bot bildirishnomalari uchun Vercel Serverless Functions ishlatiladi.

## 1. Loyihani o'rnatish

```bash
npm install
npm run dev
```

## 2. Supabase Sozlamalari

1. [Supabase](https://supabase.com/) da yangi loyiha oching.
2. SQL Editor ga kiring va `supabase/migrations/00001_initial_schema.sql` faylidagi barcha kodni nusxalab, ishga tushiring (Run).
3. **Storage** bo'limiga o'tib, `products` va `categories` nomli ikkita yangi "Public" paqir (bucket) yarating.
4. `Project Settings -> API` bo'limidan `URL` va `anon_public` kalitlarini oling.

## 3. Environment Variables (Muhit o'zgaruvchilari)

Loyiha papkasida `.env` faylini yarating va quyidagilarni kiriting:

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_ID=Sizning_Telegram_ID_Raqamingiz
VITE_BOT_TOKEN=BotFather_Bergan_Token
```

*Eslatma: `VITE_BOT_TOKEN` ni faqat Vercel dagi Environment Variables qismiga qo'shish xavfsizroq.*

## 4. Telegram Bot Sozlamalari

1. Telegramda `@BotFather` ga kiring.
2. `/newbot` buyrug'ini yuboring va botni nomlang.
3. Bot yaratilgach, tokenni oling (VITE_BOT_TOKEN).
4. BotFather da `/mybots` -> Botni tanlang -> `Bot Settings` -> `Menu Button` -> `Configure menu button` qismiga kiring.
5. `URL` ga Vercel orqali deploy qilingan loyihangiz linkini (masalan: `https://rayyanas-bakery.vercel.app`) kiriting.
6. Endi botga kirgan foydalanuvchilar "Do'konni ochish" tugmasini bosib ilovaga kira olishadi.

## 5. Vercel ga Deploy qilish

1. GitHub ga kodingizni yuklang.
2. [Vercel](https://vercel.com/) da yangi loyiha qo'shing va GitHub repozitoriyangizni ulang.
3. **Environment Variables** bo'limida barcha `.env` dagi kalitlarni (jumladan `VITE_BOT_TOKEN`) kiriting.
4. "Deploy" ni bosing.

Vercel avtomatik ravishda `/api/notify-admin.js` faylini Serverless Function sifatida taniydi va yangi buyurtmalar tushganda bot orqali adminlarga xabar yuborish mantiqini ishlatadi.

## 6. Admin Panel

Faqatgina `VITE_ADMIN_ID` ga mos keluvchi Telegram hisobidan kirilganida Profile sahifasida **Admin Panel** tugmasi paydo bo'ladi.
U yerdan mahsulot qo'shish, rasmlarni yuklash va buyurtmalarni boshqarish mumkin.
