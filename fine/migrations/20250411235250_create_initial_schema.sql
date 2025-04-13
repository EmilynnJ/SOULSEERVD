-- Create users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  balance REAL DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create readers table
CREATE TABLE readers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  bio TEXT,
  specialties TEXT,
  rate REAL NOT NULL,
  isOnline BOOLEAN DEFAULT FALSE,
  rating REAL DEFAULT 5.0,
  imageUrl TEXT,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create services table
CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  price REAL
);

-- Create bookings table
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clientId INTEGER NOT NULL,
  readerId INTEGER NOT NULL,
  serviceId INTEGER NOT NULL,
  status TEXT NOT NULL,
  scheduledTime TIMESTAMP,
  duration INTEGER,
  amount REAL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES users(id),
  FOREIGN KEY (readerId) REFERENCES readers(id),
  FOREIGN KEY (serviceId) REFERENCES services(id)
);

-- Create transactions table
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Insert some sample data for readers
INSERT INTO users (name, email, role) VALUES 
  ('Mystic Maya', 'maya@soulseer.com', 'reader'),
  ('Celestial Sarah', 'sarah@soulseer.com', 'reader'),
  ('Intuitive Ian', 'ian@soulseer.com', 'reader'),
  ('Visionary Victoria', 'victoria@soulseer.com', 'reader'),
  ('Ethereal Emma', 'emma@soulseer.com', 'reader'),
  ('Psychic Paul', 'paul@soulseer.com', 'reader');

-- Insert reader profiles
INSERT INTO readers (userId, bio, specialties, rate, isOnline, rating, imageUrl) VALUES
  (1, 'With over 15 years of experience, Maya connects with your energy to provide clear guidance.', 'Tarot, Mediumship, Love', 3.99, TRUE, 4.9, 'https://i.pravatar.cc/150?img=1'),
  (2, 'Sarah channels celestial wisdom to help you find your path and purpose.', 'Astrology, Career, Spirituality', 4.50, TRUE, 4.8, 'https://i.pravatar.cc/150?img=5'),
  (3, 'Ian uses his natural intuitive abilities to provide insights into your relationships.', 'Love, Family, Past Lives', 3.75, FALSE, 4.7, 'https://i.pravatar.cc/150?img=11'),
  (4, 'Victoria has the gift of clairvoyance, offering visions of your potential futures.', 'Future Predictions, Life Path, Destiny', 5.25, TRUE, 5.0, 'https://i.pravatar.cc/150?img=9'),
  (5, 'Emma connects with ethereal energies to bring messages from beyond.', 'Mediumship, Spirit Guides, Angels', 4.25, FALSE, 4.6, 'https://i.pravatar.cc/150?img=3'),
  (6, 'Paul combines psychic abilities with practical advice for your everyday challenges.', 'Career, Finance, Decision Making', 3.50, TRUE, 4.5, 'https://i.pravatar.cc/150?img=15');

-- Insert services
INSERT INTO services (name, description, type, price) VALUES
  ('Instant Chat Reading', 'Connect instantly with a reader via text chat.', 'chat', NULL),
  ('Voice Call Reading', 'Speak directly with your chosen psychic advisor.', 'call', NULL),
  ('Video Reading', 'Face-to-face virtual session with your reader.', 'video', NULL),
  ('Scheduled Reading - 30 min', 'Book a 30-minute session in advance.', 'scheduled', 60.00),
  ('Scheduled Reading - 60 min', 'Book a 60-minute session in advance.', 'scheduled', 100.00);