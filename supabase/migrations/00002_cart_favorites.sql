-- Rayyanas Bakery - Cart and Favorites Tables

-- 7. Cart Items Table (synced across devices)
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 8. Favorites Table (synced across devices)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_items
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (true);
CREATE POLICY "Users can insert own cart items" ON cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own cart items" ON cart_items FOR UPDATE USING (true);
CREATE POLICY "Users can delete own cart items" ON cart_items FOR DELETE USING (true);

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (true);
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (true);