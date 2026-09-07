import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
const WebApp = (window as any).Telegram.WebApp;

export default function Checkout() {
  const { cart, clearCart, user, cartTotal } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
        delivery_address: formData.address,
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
              address: formData.address,
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
          <textarea required name="address" value={formData.address} onChange={handleChange} className="w-full bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary min-h-[80px]" placeholder="Shahar, tuman, ko'cha, uy..."></textarea>
        </div>

        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">Izoh (ixtiyoriy)</label>
          <textarea name="comments" value={formData.comments} onChange={handleChange} className="w-full bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary min-h-[80px]" placeholder="Buyurtma uchun qo'shimcha istaklar..."></textarea>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg mt-4 disabled:opacity-70"
        >
          {loading ? 'Yuborilmoqda...' : 'Tasdiqlash'}
        </button>
      </form>
    </div>
  );
}
