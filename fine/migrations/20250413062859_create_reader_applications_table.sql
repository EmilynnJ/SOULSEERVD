-- Create reader applications table
CREATE TABLE reader_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience TEXT NOT NULL,
  specialties TEXT NOT NULL,
  motivation TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);