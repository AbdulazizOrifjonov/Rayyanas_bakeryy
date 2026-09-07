export type Language = 'uz' | 'ru' | 'en';

export const translations = {
  uz: {
    welcome: 'Xush kelibsiz!',
    subtitle: 'Premium tortlar, shirinliklar va pishiriqlar olami.',
    view_menu: "Menyuni ko'rish",
    categories: 'Kategoriyalar',
    all: 'Barchasi',
    popular: 'Mashhur mahsulotlar',
    home: 'Asosiy',
    catalog: 'Katalog',
    favorites: 'Sevimlilar',
    cart: 'Savat',
    profile: 'Profil',
    add_to_cart: "Savatga qo'shish",
    cart_empty: "Savatingiz bo'sh",
    cart_empty_desc: "Menyudan mazali shirinliklarni tanlab, savatga qo'shishingiz mumkin.",
    go_to_menu: "Menyuga o'tish",
    total: "Jami",
    checkout: "Buyurtma berish",
    checkout_title: "Rasmiylashtirish",
    name: "Ism",
    phone: "Telefon raqam",
    address_label: "Yetkazib berish manzili",
    map_label: "Yandex Xarita orqali belgilang",
    map_hint: "Xaritani bosib manzilni belgilang yoki lokatsiya tugmasini bosing",
    comments: "Izoh (ixtiyoriy)",
    submit: "Tasdiqlash",
    submitting: "Yuborilmoqda...",
    orders: "Buyurtmalar",
    admin_panel: "Admin Panel",
    currency: "so'm",
    new: "Yangi",
    order_success: "Buyurtma qabul qilindi! Adminlar tez orada bog'lanishadi.",
    error_occurred: "Xatolik yuz berdi"
  },
  ru: {
    welcome: 'Добро пожаловать!',
    subtitle: 'Мир премиальных тортов, сладостей и выпечки.',
    view_menu: 'Смотреть меню',
    categories: 'Категории',
    all: 'Все',
    popular: 'Популярные',
    home: 'Главная',
    catalog: 'Каталог',
    favorites: 'Избранное',
    cart: 'Корзина',
    profile: 'Профиль',
    add_to_cart: 'В корзину',
    cart_empty: 'Корзина пуста',
    cart_empty_desc: 'Выберите вкусные сладости из меню и добавьте их в корзину.',
    go_to_menu: 'Перейти в меню',
    total: 'Итого',
    checkout: 'Оформить заказ',
    checkout_title: 'Оформление',
    name: 'Имя',
    phone: 'Номер телефона',
    address_label: 'Адрес доставки',
    map_label: 'Укажите через Яндекс Карту',
    map_hint: 'Нажмите на карту чтобы указать адрес или нажмите кнопку локации',
    comments: 'Комментарий (необязательно)',
    submit: 'Подтвердить',
    submitting: 'Отправка...',
    orders: 'Заказы',
    admin_panel: 'Админ панель',
    currency: 'сум',
    new: 'Новый',
    order_success: "Заказ принят! Администраторы скоро свяжутся с вами.",
    error_occurred: "Произошла ошибка"
  },
  en: {
    welcome: 'Welcome!',
    subtitle: 'World of premium cakes, sweets and pastries.',
    view_menu: 'View Menu',
    categories: 'Categories',
    all: 'View All',
    popular: 'Popular Products',
    home: 'Home',
    catalog: 'Catalog',
    favorites: 'Favorites',
    cart: 'Cart',
    profile: 'Profile',
    add_to_cart: 'Add to Cart',
    cart_empty: 'Your cart is empty',
    cart_empty_desc: 'Choose delicious sweets from the menu and add them to your cart.',
    go_to_menu: 'Go to Menu',
    total: 'Total',
    checkout: 'Checkout',
    checkout_title: 'Checkout',
    name: 'Name',
    phone: 'Phone Number',
    address_label: 'Delivery Address',
    map_label: 'Select via Yandex Map',
    map_hint: 'Click on the map to set address or use the locate button',
    comments: 'Comments (optional)',
    submit: 'Confirm',
    submitting: 'Submitting...',
    orders: 'Orders',
    admin_panel: 'Admin Panel',
    currency: 'uzs',
    new: 'New',
    order_success: "Order accepted! Admins will contact you shortly.",
    error_occurred: "An error occurred"
  }
};

export function t(key: keyof typeof translations['uz'], lang: Language): string {
  return translations[lang][key] || translations['uz'][key];
}

const translateCache = new Map<string, string>();

export async function translateDynamic(texts: string[], targetLang: Language): Promise<string[]> {
  if (targetLang === 'uz' || texts.length === 0) return texts;
  
  const cacheKey = targetLang + ':' + texts.join('|');
  if (translateCache.has(cacheKey)) {
    return translateCache.get(cacheKey)!.split('|||');
  }

  try {
    const query = encodeURIComponent(texts.join('\n'));
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl=${targetLang}&dt=t&q=${query}`);
    const data = await res.json();
    
    // data[0] is an array of translated lines
    const translatedText = data[0].map((item: any) => item[0]).join('');
    const result = translatedText.split('\n').map((s: string) => s.trim());
    
    // Fallback if mismatch
    if (result.length !== texts.length) return texts;
    
    translateCache.set(cacheKey, result.join('|||'));
    return result;
  } catch (e) {
    console.error('Translation failed', e);
    return texts;
  }
}
