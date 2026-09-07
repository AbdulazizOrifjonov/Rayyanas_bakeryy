import { supabase } from './supabase';
import { Product } from '../store/useStore';

export interface Category {
  id: string;
  name: string;
  image_url: string;
  sort_order: number;
}

export const api = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data as Category[];
  },

  async getProducts(categoryId?: string) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_available', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  },

  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .eq('is_featured', true)
      .limit(6);
    
    if (error) throw error;
    return data as Product[];
  },

  async createOrder(orderData: any, items: any[]) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  }
};
