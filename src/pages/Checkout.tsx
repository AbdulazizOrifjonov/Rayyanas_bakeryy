import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
const WebApp = (window as any).Telegram.WebApp;

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Location Marker Component
function LocationMarker({ coords, setCoords, setHasMoved }: any) {
  const map = useMapEvents({
    click(e) {
      setCoords([e.latlng.lat, e.latlng.lng]);
      setHasMoved(true);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // We expose a global function to let the parent trigger flyTo when GPS button is clicked
  (window as any).flyToLocation = (lat: number, lng: number) => {
    map.flyTo([lat, lng], 16);
  };

  return coords === null ? null : (
    <Marker position={coords}></Marker>
  );
}

export default function Checkout() {
  const { cart, clearCart, user, cartTotal } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<[number, number]>([41.2995, 69.2401]); // Default Tashkent
  const [hasMoved, setHasMoved] = useState(false);

  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setCoords(newCoords);
        setHasMoved(true);
        if ((window as any).flyToLocation) (window as any).flyToLocation(newCoords[0], newCoords[1]);
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
        WebApp.showAlert('Buyurtmangiz qabul qilindi! Adminlar tez orada siz bilan bog\'lanishadi.');
      } else {
        alert('Buyurtmangiz qabul qilindi! Adminlar tez orada siz bilan bog\'lanishadi.');
      }
      clearCart();
      navigate('/profile');
    } catch (error) {
      console.error(error);
      if (WebApp?.showAlert) {
        WebApp.showAlert('Xatolik yuz berdi');
      } else {
        alert('Xatolik yuz berdi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Rasmiylashtirish</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">Ism</label>
          <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary" placeholder="Ismingiz" />
        </div>
        
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">Telefon raqam</label>
          <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary" placeholder="+998 90 123 45 67" />
        </div>

        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">Yetkazib berish manzili</label>
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
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">Izoh (ixtiyoriy)</label>
          <textarea name="comments" value={formData.comments} onChange={handleChange} className="w-full bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary min-h-[80px]" placeholder="Buyurtma uchun qo'shimcha istaklar..."></textarea>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg mt-2 disabled:opacity-70 shadow-md"
        >
          {loading ? 'Yuborilmoqda...' : 'Tasdiqlash'}
        </button>

        {/* MAP SECTION AT THE VERY BOTTOM */}
        <div className="mt-4 border-t border-border/50 pt-4">
          <label className="text-sm font-bold text-foreground mb-2 flex items-center justify-between">
            <span>Xarita orqali belgilang</span>
          </label>
          <div className="w-full h-64 rounded-2xl overflow-hidden border-2 border-amber-200 bg-muted/50 mb-1 relative shadow-sm">
            <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker coords={coords} setCoords={setCoords} setHasMoved={setHasMoved} />
            </MapContainer>
            
            {/* Locate Me Button */}
            <button
              onClick={handleLocateMe}
              type="button"
              className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-blue-500 active:scale-95 transition-transform z-10"
            >
              <LocateFixed size={24} />
            </button>
          </div>
          <p className="text-xs font-medium text-amber-600 text-center">Xaritani bosib manzilni belgilang yoki lokatsiya tugmasini bosing</p>
        </div>
      </form>
    </div>
  );
}
