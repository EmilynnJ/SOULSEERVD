-- Create admin user
INSERT INTO users (name, email, role, balance, createdAt, updatedAt)
VALUES ('Admin User', 'emilynnj14@gmail.com', 'admin', 1000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create reader user
INSERT INTO users (name, email, role, balance, createdAt, updatedAt)
VALUES ('Reader User', 'emilynn992@gmail.com', 'reader', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create reader profile for the reader user
INSERT INTO readers (userId, bio, specialties, rate, isOnline, rating, imageUrl)
VALUES (
  (SELECT id FROM users WHERE email = 'emilynn992@gmail.com'),
  'Experienced psychic with over 10 years of helping clients find clarity and guidance.',
  'Tarot, Mediumship, Love Readings',
  4.99,
  TRUE,
  4.9,
  'https://i.pravatar.cc/300?img=28'
);