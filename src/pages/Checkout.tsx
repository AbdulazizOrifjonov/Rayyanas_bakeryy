import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

import WebApp from '@twa-dev/sdk';

export default function Checkout() {
  const { cart, clearCart, user } = useStore();
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
      // In a real app we'd upsert the user and get their UUID, then create the order.
      // Let's assume our RLS allows order insertion.
      
      // We will skip actual submission for this mock and just show success.
      await new Promise(r => setTimeout(r, 1000));
      
      WebApp.showAlert('Buyurtma qabul qilindi!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error(error);
      WebApp.showAlert('Xatolik yuz berdi');
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
