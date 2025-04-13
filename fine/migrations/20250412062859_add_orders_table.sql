-- Create orders table
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  total REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  itemCount INTEGER NOT NULL,
  shippingAddress TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create order_items table
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id)
);

-- Create products table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  imageUrl TEXT,
  category TEXT NOT NULL,
  inventory INTEGER DEFAULT 0,
  stripeProductId TEXT,
  stripePriceId TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, description, price, imageUrl, category, inventory, stripeProductId, stripePriceId) VALUES
  ('Crystal Healing Set', 'A collection of healing crystals for energy balancing and spiritual growth.', 49.99, 'https://images.unsplash.com/photo-1603344204980-4edb0ea63148?q=80&w=2070&auto=format&fit=crop', 'Crystals', 25, 'prod_OXYZabcdef123', 'price_OXYZabcdef123'),
  ('Tarot Card Deck', 'Beautifully illustrated tarot deck with guidebook for beginners and advanced readers.', 29.99, 'https://images.unsplash.com/photo-1633058851353-e5166a0ebc3f?q=80&w=2070&auto=format&fit=crop', 'Tarot', 50, 'prod_OXYZabcdef124', 'price_OXYZabcdef124'),
  ('Chakra Meditation Guide', 'Comprehensive guide to chakra meditation with audio downloads.', 19.99, 'https://images.unsplash.com/photo-1602940659805-770d1b3b9911?q=80&w=2070&auto=format&fit=crop', 'Books', 100, 'prod_OXYZabcdef125', 'price_OXYZabcdef125'),
  ('Aura Cleansing Kit', 'Complete kit for cleansing your aura and living space.', 34.99, 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=2070&auto=format&fit=crop', 'Spiritual', 30, 'prod_OXYZabcdef126', 'price_OXYZabcdef126'),
  ('Astrology Birth Chart Analysis', 'Digital download with your personalized birth chart analysis.', 24.99, 'https://images.unsplash.com/photo-1515942661900-94b3d1972591?q=80&w=2070&auto=format&fit=crop', 'Digital', 999, 'prod_OXYZabcdef127', 'price_OXYZabcdef127'),
  ('Meditation Cushion Set', 'Comfortable cushion set for your meditation practice.', 59.99, 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2070&auto=format&fit=crop', 'Meditation', 20, 'prod_OXYZabcdef128', 'price_OXYZabcdef128'),
  ('Spiritual Growth Journal', 'Guided journal for tracking your spiritual journey and insights.', 15.99, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=2070&auto=format&fit=crop', 'Books', 75, 'prod_OXYZabcdef129', 'price_OXYZabcdef129'),
  ('Essential Oil Diffuser', 'Elegant diffuser for aromatherapy and spiritual practices.', 39.99, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=2070&auto=format&fit=crop', 'Wellness', 40, 'prod_OXYZabcdef130', 'price_OXYZabcdef130');

-- Insert sample orders
INSERT INTO orders (userId, total, status, itemCount, shippingAddress, createdAt) VALUES
  (1, 79.98, 'completed', 2, '123 Main St, Anytown, USA', '2025-04-01 10:30:00'),
  (1, 34.99, 'processing', 1, '123 Main St, Anytown, USA', '2025-04-10 15:45:00');

-- Insert sample order items
INSERT INTO order_items (orderId, productId, name, price, quantity) VALUES
  (1, 1, 'Crystal Healing Set', 49.99, 1),
  (1, 2, 'Tarot Card Deck', 29.99, 1),
  (2, 4, 'Aura Cleansing Kit', 34.99, 1);