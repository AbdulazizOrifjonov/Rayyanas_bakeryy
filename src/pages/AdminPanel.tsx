import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Plus, Trash2, Edit3, X, Save, Image } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_id: string;
  is_featured: boolean;
  is_available: boolean;
}

const emptyForm: ProductForm = {
  name: '', description: '', price: '', image_url: '',
  category_id: '', is_featured: false, is_available: true
};

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
  });
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'orders' ? 'orders' : 'products';
  
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>(initialTab);
  const [catForm, setCatForm] = useState({ name: '', image_url: '' });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
      return data || [];
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').order('sort_order');
      return data || [];
    }
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select('*, users(first_name, last_name, username, phone_number, telegram_id), order_items(*, products(name, image_url))').order('created_at', { ascending: false });
      return data || [];
    }
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status, telegramId }: { id: string, status: string, telegramId?: string }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
      
      if (telegramId && status !== 'new') {
        const statuses: Record<string, string> = {
          'accepted': 'Qabul qilindi ✅',
          'preparing': 'Tayyorlanmoqda 👨‍🍳',
          'delivering': 'Yetkazilmoqda 🚚',
          'completed': 'Yetkazib berildi 🎉',
          'cancelled': 'Bekor qilindi ❌'
        };
        try {
          await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramId,
              text: `Sizning buyurtmangiz holati o'zgardi:\n\nHolat: <b>${statuses[status]}</b>`,
              parse_mode: 'HTML'
            })
          });
        } catch (e) {
          console.error('Failed to notify user', e);
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  });

  const saveMutation = useMutation({
    mutationFn: async (product: ProductForm) => {
      const payload = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price) || 0,
        image_url: product.image_url,
        category_id: product.category_id || null,
        is_featured: product.is_featured,
        is_available: product.is_available,
      };
      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const saveCatMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('categories').insert({ name: catForm.name, image_url: catForm.image_url || null });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setCatForm({ name: '', image_url: '' });
    }
  });

  const deleteCatMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      image_url: product.image_url || '',
      category_id: product.category_id || '',
      is_featured: product.is_featured || false,
      is_available: product.is_available !== false,
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 bg-white sticky top-0 z-30 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.06)] flex items-center gap-3">
        <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 pt-4 pb-2">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'products' ? 'bg-foreground text-white' : 'bg-muted text-muted-foreground'}`}
        >
          Mahsulotlar
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'categories' ? 'bg-foreground text-white' : 'bg-muted text-muted-foreground'}`}
        >
          Kategoriyalar
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'orders' ? 'bg-foreground text-white' : 'bg-muted text-muted-foreground'}`}
        >
          Buyurtmalar
        </button>
      </div>

      <div className="px-5">
        {activeTab === 'products' && (
          <>
            {/* Add button */}
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold flex items-center justify-center gap-2 mb-4 shadow-md active:scale-[0.98] transition-transform"
            >
              <Plus size={20} /> Yangi mahsulot
            </button>

            {/* Product Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/50 z-[100] flex items-end">
                <div className="bg-white w-full rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{editingId ? 'Tahrirlash' : 'Yangi mahsulot'}</h2>
                    <button onClick={() => { setShowForm(false); setEditingId(null); }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <input
                      placeholder="Mahsulot nomi"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500"
                    />
                    <textarea
                      placeholder="Tavsif"
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 min-h-[80px]"
                    />
                    <input
                      placeholder="Narx (so'm)"
                      type="number"
                      value={form.price}
                      onChange={e => setForm({...form, price: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500"
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground block">Rasmlar (Max 5 ta)</label>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const imgs = form.image_url ? (form.image_url.startsWith('[') ? JSON.parse(form.image_url) : [form.image_url]) : [];
                          return imgs.map((img: string, idx: number) => (
                            <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border">
                              <img src={img} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => {
                                  const arr = [...imgs];
                                  arr.splice(idx, 1);
                                  setForm({...form, image_url: arr.length ? JSON.stringify(arr) : ''});
                                }}
                                className="absolute top-0 right-0 bg-red-500/80 text-white p-1 rounded-bl-lg"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ));
                        })()}
                        {(!form.image_url || (form.image_url.startsWith('[') ? JSON.parse(form.image_url).length : 1) < 5) && (
                          <label className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 cursor-pointer border border-amber-200">
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple
                              className="hidden" 
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                let current = form.image_url ? (form.image_url.startsWith('[') ? JSON.parse(form.image_url) : [form.image_url]) : [];
                                for(const file of files) {
                                  if (current.length >= 5) break;
                                  const base64 = await resizeImage(file);
                                  current.push(base64);
                                }
                                setForm({...form, image_url: JSON.stringify(current)});
                              }} 
                            />
                            <Plus size={24} />
                          </label>
                        )}
                      </div>
                    </div>

                    <select
                      value={form.category_id}
                      onChange={e => setForm({...form, category_id: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500"
                    >
                      <option value="">Kategoriya tanlang</option>
                      {categories?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} className="accent-amber-500" />
                        Mashhur
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} className="accent-amber-500" />
                        Mavjud
                      </label>
                    </div>

                    <button
                      onClick={() => saveMutation.mutate(form)}
                      disabled={!form.name || !form.price || saveMutation.isPending}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save size={18} />
                      {saveMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products List */}
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products?.map((p: any) => (
                  <div key={p.id} className="bg-card rounded-xl p-3 border border-border/50 shadow-sm flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      {(() => {
                        const imgUrl = p.image_url;
                        const firstImg = imgUrl ? (imgUrl.startsWith('[') ? JSON.parse(imgUrl)[0] : imgUrl) : null;
                        return firstImg ? <img src={firstImg} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎂</div>;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.categories?.name || 'Kategoriyasiz'}</p>
                      <p className="text-sm font-bold text-amber-600 mt-0.5">{Number(p.price).toLocaleString()} so'm</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => { if(confirm('O\'chirish?')) deleteMutation.mutate(p.id); }} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'categories' && (
          <>
            {/* Add Category */}
            <div className="bg-card rounded-xl p-4 border border-border/50 mb-4 flex flex-col gap-3">
              <input
                placeholder="Kategoriya nomi"
                value={catForm.name}
                onChange={e => setCatForm({...catForm, name: e.target.value})}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500"
              />
              <div className="flex gap-2">
                <input
                  placeholder="Rasm URL (ixtiyoriy) yoki fayl tanlang"
                  value={catForm.image_url}
                  onChange={e => setCatForm({...catForm, image_url: e.target.value})}
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500"
                />
                <label className="w-12 h-[46px] rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 cursor-pointer shrink-0 border border-amber-200">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await resizeImage(file);
                        setCatForm({...catForm, image_url: base64});
                      }
                    }} 
                  />
                  <Image size={20} />
                </label>
              </div>
              <button
                onClick={() => catForm.name && saveCatMutation.mutate()}
                disabled={!catForm.name || saveCatMutation.isPending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold disabled:opacity-50"
              >
                {saveCatMutation.isPending ? 'Saqlanmoqda...' : 'Kategoriya qo\'shish'}
              </button>
            </div>

            {/* Categories List */}
            <div className="flex flex-col gap-2">
              {categories?.map((cat: any) => (
                <div key={cat.id} className="bg-card rounded-xl p-3 border border-border/50 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                    {cat.image_url ? <img src={cat.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">📁</div>}
                  </div>
                  <span className="font-medium text-sm flex-1">{cat.name}</span>
                  <button onClick={() => { if(confirm('O\'chirish?')) deleteCatMutation.mutate(cat.id); }} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="flex flex-col gap-3">
            {ordersLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders?.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">Buyurtmalar yo'q</p>
            ) : (
              orders?.map((order: any) => (
                <div key={order.id} className="bg-card rounded-xl p-4 border border-border/50 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">Mijoz: {order.users?.first_name || 'Noma\'lum'} {order.users?.username ? `(@${order.users.username})` : ''}</p>
                      <p className="text-xs text-muted-foreground mt-1">Tel: {order.users?.phone_number || order.phone_number || 'Kiritilmagan'}</p>
                      <p className="text-xs text-muted-foreground mt-1">Sana: {new Date(order.created_at).toLocaleString('uz-UZ')}</p>
                    </div>
                    <span className="font-bold text-amber-600 text-sm">{Number(order.total_amount).toLocaleString()} so'm</span>
                  </div>
                  
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="bg-amber-50/50 p-2.5 rounded-xl text-xs space-y-2 border border-amber-100 mt-1">
                      <p className="font-bold text-amber-900 mb-1 border-b border-amber-200/50 pb-1.5">Sotib olinganlar:</p>
                      {order.order_items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-amber-100/50 shadow-sm text-amber-900">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0 border border-border/50">
                              {(() => {
                                const imgUrl = item.products?.image_url;
                                const firstImg = imgUrl ? (imgUrl.startsWith('[') ? JSON.parse(imgUrl)[0] : imgUrl) : null;
                                return firstImg ? (
                                  <img src={firstImg} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="w-full h-full flex items-center justify-center text-lg">🎂</span>
                                );
                              })()}
                            </div>
                            <span className="font-semibold text-xs leading-tight">{item.products?.name || 'Noma\'lum'}</span>
                          </div>
                          <span className="font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-[10px] shrink-0 whitespace-nowrap">{item.quantity} ta</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {order.delivery_address && (
                    <div className="bg-blue-50/50 p-2.5 rounded-xl text-xs border border-blue-100 flex flex-col gap-1">
                      <span className="font-bold text-blue-900">Manzil:</span>
                      <p className="text-blue-800 break-words whitespace-pre-wrap leading-relaxed">
                        {order.delivery_address.split(/(https?:\/\/[^\s]+)/g).map((part: string, i: number) => 
                          part.match(/^https?:\/\//) ? (
                            <a key={i} href={part} target="_blank" rel="noreferrer" className="inline-block mt-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm active:scale-95 transition-transform">
                              📍 Xaritada ko'rish
                            </a>
                          ) : (
                            part.replace('(Link: ', '').replace(')', '').replace('📍 Yandex Map: ', '')
                          )
                        )}
                      </p>
                    </div>
                  )}
                  
                  {order.comments && order.comments !== '-' && (
                    <div className="bg-gray-50/80 p-2.5 rounded-xl text-xs border border-gray-100 flex flex-col gap-0.5">
                      <span className="font-bold text-gray-700">Izoh:</span>
                      <p className="text-gray-600 italic">"{order.comments}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Holati:</span>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus.mutate({ id: order.id, status: e.target.value, telegramId: order.users?.telegram_id })}
                        disabled={updateOrderStatus.isPending}
                        className={`text-xs font-bold px-2 py-1 rounded-md outline-none ${
                          order.status === 'new' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <option value="new">Yangi</option>
                        <option value="accepted">Qabul qilindi</option>
                        <option value="preparing">Tayyorlanmoqda</option>
                        <option value="delivering">Yetkazilmoqda</option>
                        <option value="completed">Bajarildi</option>
                        <option value="cancelled">Bekor qilindi</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={() => { if(confirm("Haqiqatdan ham bu buyurtmani o'chirmoqchimisiz?")) deleteOrderMutation.mutate(order.id); }}
                      disabled={deleteOrderMutation.isPending}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 active:scale-95 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
