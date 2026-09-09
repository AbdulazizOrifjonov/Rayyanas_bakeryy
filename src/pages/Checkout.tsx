import { useState } from 'react';
import { useStore } from '../store/useStore';
import { t } from '../lib/i18n';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LocateFixed, MapPin } from 'lucide-react';
import YandexMapModal from '../components/YandexMapModal';
import { parseImages } from '../utils/imageParser';
const WebApp = (window as any).Telegram.WebApp;

export default function Checkout() {
  const { cart, clearCart, user, cartTotal, lang } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<[number, number]>([41.2995, 69.2401]); // Default Tashkent
  const [hasMoved, setHasMoved] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleModalLocationSelect = (newCoords: [number, number]) => {
    setCoords(newCoords);
    setHasMoved(true);
    const link = `https://yandex.com/maps/?pt=${newCoords[1]},${newCoords[0]}&z=17&l=map`;
    setFormData(prev => ({ ...prev, address: prev.address && !prev.address.includes('yandex') ? prev.address + '\n' + link : link }));
  };

  const openMapModal = () => {
    setIsMapModalOpen(true);
  };

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: '',
    address: '',
    comments: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!hasMoved) {
      if (WebApp?.showAlert) {
        WebApp.showAlert("Iltimos, yetkazib berish uchun xaritadan manzilingizni belgilang!");
      } else {
        alert("Iltimos, yetkazib berish uchun xaritadan manzilingizni belgilang!");
      }
      return;
    }

    setLoading(true);
    try {
      // Check if user exists in our DB, if not create
      const telegramId = user?.id?.toString() || 'anonymous';
      
      let { data: dbUser } = await supabase.from('users').select('id').eq('telegram_id', telegramId).single();
      
      if (!dbUser) {
        const { data: newUser, error: userError } = await supabase.from('users').insert({
          telegram_id: telegramId,
          username: user?.username || '',
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone
        }).select().single();
        if (userError) throw userError;
        dbUser = newUser;
      }
      
      // Insert Order
      const totalAmount = cartTotal();
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: dbUser!.id,
        total_amount: totalAmount,
        status: 'new',
        delivery_address: formData.address + (hasMoved ? `\n📍 Yandex Map: https://yandex.com/maps/?pt=${coords[1]},${coords[0]}&z=17&l=map` : ''),
        phone_number: formData.phone
      }).select().single();

      if (orderError) throw orderError;

      // Insert Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      try {
        await fetch('/api/notify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderDetails: {
              phone: formData.phone,
              addressText: formData.address,
              mapLink: hasMoved && !formData.address.includes('yandex') ? `https://yandex.com/maps/?pt=${coords[1]},${coords[0]}&z=17&l=map` : null,
              comments: formData.comments,
              total: totalAmount,
              items: cart.map(i => ({ name: i.name, quantity: i.quantity, id: i.id, image_url: parseImages(i.image_url)[0] }))
            },
            userDetails: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              username: user?.username
            }
          })
        });
      } catch (e) {
        console.error('Notification failed', e);
      }

      if (WebApp?.showAlert) {
        WebApp.showAlert(t('order_success', lang) || 'Buyurtmangiz qabul qilindi! Adminlar tez orada siz bilan bog\'lanishadi.');
      } else {
        alert(t('order_success', lang) || 'Buyurtmangiz qabul qilindi! Adminlar tez orada siz bilan bog\'lanishadi.');
      }
      clearCart();
      navigate('/profile');
    } catch (error) {
      console.error(error);
      if (WebApp?.showAlert) {
        WebApp.showAlert(t('error_occurred', lang) || 'Xatolik yuz berdi');
      } else {
        alert(t('error_occurred', lang) || 'Xatolik yuz berdi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{t('checkout_title', lang)}</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">{t('name', lang)}</label>
          <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary" placeholder="Ismingiz" />
        </div>
        
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">{t('phone', lang)}</label>
          <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary" placeholder="+998 90 123 45 67" />
        </div>

        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-2 flex items-center justify-between">
            <span>{t('address_label', lang)}</span>
          </label>

          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  setCoords([pos.coords.latitude, pos.coords.longitude]);
                  setHasMoved(true);
                  const link = `https://yandex.com/maps/?pt=${pos.coords.longitude},${pos.coords.latitude}&z=17&l=map`;
                  setFormData(prev => ({ ...prev, address: prev.address && !prev.address.includes('yandex') ? prev.address + '\n' + link : link }));
                  if ((window as any).flyToLocation) {
                    (window as any).flyToLocation(pos.coords.latitude, pos.coords.longitude);
                  }
                  if ((window as any).Telegram?.WebApp?.showAlert) {
                    (window as any).Telegram.WebApp.showAlert("Lokatsiya aniqlandi va xaritaga belgilandi!");
                  } else {
                    alert("Lokatsiya aniqlandi va xaritaga belgilandi!");
                  }
                }, () => {
                  if ((window as any).Telegram?.WebApp?.showAlert) {
                    (window as any).Telegram.WebApp.showAlert("Lokatsiyani aniqlab bo'lmadi. Telefoningizda GPS (Lokatsiya) ruxsat berilganligiga ishonch hosil qiling.");
                  } else {
                    alert("Lokatsiyani aniqlab bo'lmadi. GPS (Lokatsiya) ruxsat berilganligiga ishonch hosil qiling.");
                  }
                });
              } else {
                alert("Sizning qurilmangizda lokatsiyani aniqlash funksiyasi yo'q.");
              }
            }}
            className="w-full mb-3 bg-blue-50 text-blue-600 border border-blue-200 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-blue-100 transition-colors"
          >
            <LocateFixed size={18} />
            Hozirgi joylashuvimni aniqlash
          </button>
        </div>

        {/* MAP SECTION - Full Screen Modal */}
        <div className="border-t border-border/50 pt-2 pb-2">
          <label className="text-sm font-bold text-foreground mb-2 flex items-center justify-between">
            <span>Xaritadan tanlang <span className="text-red-500">*</span></span>
          </label>
          <button
            type="button"
            onClick={openMapModal}
            className="w-full h-64 rounded-2xl overflow-hidden border-2 border-amber-200 mb-1 relative shadow-sm flex flex-col items-center justify-center gap-2 p-4 text-center transition-colors hover:border-amber-300 active:border-amber-400 group bg-amber-50"
          >
            {/* Background Map Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-active:opacity-50 transition-opacity"
              style={{ backgroundImage: "url('https://static-maps.yandex.ru/1.x/?ll=69.2401,41.2995&size=600,400&z=13&l=map')" }}
            />
            
            <div className="relative z-10 flex flex-col items-center bg-white/90 p-5 rounded-2xl backdrop-blur-md border border-amber-100/50 shadow-lg w-full max-w-[260px]">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-3 shadow-inner">
                <MapPin size={28} className="text-amber-600 animate-bounce" />
              </div>
              <span className="text-[17px] font-bold text-gray-900 leading-tight mb-1">Xaritani ochish</span>
              <span className="text-[13px] text-gray-600 font-medium">Yandex xaritasida belgilash</span>
              {hasMoved && (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-4 py-1.5 rounded-full mt-3 shadow-sm border border-green-200 w-full">
                  ✓ Manzil tanlandi
                </span>
              )}
            </div>
          </button>
          <p className="text-xs font-medium text-amber-600 text-center mt-1">{t('map_hint', lang)}</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">{t('comments', lang)}</label>
<textarea name="comments" value={formData.comments} onChange={handleChange} className="w-full bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary min-h-[80px]" placeholder="Buyurtma uchun qo'shimcha istaklar..."></textarea>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg mt-2 disabled:opacity-70 shadow-md"
        >
          {loading ? t('submitting', lang) : t('submit', lang)}
        </button>
      </form>

      <YandexMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onLocationSelect={handleModalLocationSelect}
        initialCenter={coords}
        initialZoom={13}
      />
    </div>
  );
}
