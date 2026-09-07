import { useState } from 'react';
import { useStore } from '../store/useStore';
import { t } from '../lib/i18n';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { YMaps, Map as YMap, Placemark } from '@pbe/react-yandex-maps';
import { LocateFixed } from 'lucide-react';
const WebApp = (window as any).Telegram.WebApp;

export default function Checkout() {
  const { cart, clearCart, user, cartTotal, lang } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<[number, number]>([41.2995, 69.2401]); // Default Tashkent
  const [hasMoved, setHasMoved] = useState(false);
  const [mapInst, setMapInst] = useState<any>(null);

  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setCoords(newCoords);
        setHasMoved(true);
        if (mapInst) mapInst.setCenter(newCoords, 16);
      }, () => {
        if ((window as any).Telegram?.WebApp?.showAlert) {
          (window as any).Telegram.WebApp.showAlert("Lokatsiyani aniqlab bo'lmadi. Telefoningizda GPS (Lokatsiya) yoqilganiga ishonch hosil qiling.");
        } else {
          alert("Lokatsiyani aniqlab bo'lmadi. GPS yoqilganini tekshiring.");
        }
      });
    }
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
        delivery_address: `${formData.address}${hasMoved ? ` (Link: https://yandex.com/maps/?pt=${coords[1]},${coords[0]}&z=17&l=map)` : ''}`,
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
              address: `${formData.address}${hasMoved ? `\n📍 Xarita: https://yandex.com/maps/?pt=${coords[1]},${coords[0]}&z=17&l=map` : ''}`,
              comments: formData.comments,
              total: totalAmount,
              items: cart.map(i => `${i.name} (${i.quantity} dona)`).join(', ')
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
                  const link = `https://yandex.com/maps/?pt=${pos.coords.longitude},${pos.coords.latitude}&z=17&l=map`;
                  setFormData(prev => ({ ...prev, address: prev.address ? prev.address + '\n📍 ' + link : '📍 ' + link }));
                  if ((window as any).Telegram?.WebApp?.showAlert) {
                    (window as any).Telegram.WebApp.showAlert("Lokatsiya manzilga qo'shildi!");
                  }
                }, () => {
                  if ((window as any).Telegram?.WebApp?.showAlert) {
                    (window as any).Telegram.WebApp.showAlert("Lokatsiyani aniqlab bo'lmadi. Telefoningizda GPS (Lokatsiya) yoqilganiga ishonch hosil qiling.");
                  }
                });
              }
            }}
            className="w-full mb-3 bg-blue-50 text-blue-600 border border-blue-200 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-blue-100 transition-colors"
          >
            <LocateFixed size={18} />
            Hozirgi joylashuvimni aniqlash
          </button>

          <textarea 
            required 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            className="w-full bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary min-h-[80px] mb-3" 
            placeholder="Shahar, tuman, ko'cha, uy..." 
          />

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

        {/* MAP SECTION AT THE VERY BOTTOM */}
        <div className="mt-4 border-t border-border/50 pt-4">
          <label className="text-sm font-bold text-foreground mb-2 flex items-center justify-between">
            <span>{t('map_label', lang)}</span>
          </label>
          <div className="w-full h-64 rounded-2xl overflow-hidden border-2 border-amber-200 bg-muted/50 mb-1 relative shadow-sm">
            <YMaps query={{ lang: 'ru_RU' }}>
              <YMap 
                instanceRef={(ref) => setMapInst(ref)}
                defaultState={{ center: [41.2995, 69.2401], zoom: 12 }} 
                width="100%" 
                height="100%"
                onClick={(e: any) => {
                  setCoords(e.get('coords'));
                  setHasMoved(true);
                }}
              >
                {hasMoved && <Placemark geometry={coords} />}
              </YMap>
            </YMaps>
            
            {/* Locate Me Button */}
            <button
              onClick={handleLocateMe}
              type="button"
              className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-blue-500 active:scale-95 transition-transform z-10"
            >
              <LocateFixed size={24} />
            </button>
          </div>
          <p className="text-xs font-medium text-amber-600 text-center">{t('map_hint', lang)}</p>
        </div>
      </form>
    </div>
  );
}
