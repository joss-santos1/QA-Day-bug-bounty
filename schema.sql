-- DogMatch Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dogs table
CREATE TABLE IF NOT EXISTS dogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  breed VARCHAR(255) NOT NULL,
  bio TEXT,
  photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Swipes table (tracks who swiped on whom)
CREATE TABLE IF NOT EXISTS swipes (
  id SERIAL PRIMARY KEY,
  from_dog_id INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  to_dog_id INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('left', 'right')),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table (mutual swipes right)
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  dog1_id INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  dog2_id INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_dogs_user_id ON dogs(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_from_dog ON swipes(from_dog_id);
CREATE INDEX IF NOT EXISTS idx_swipes_to_dog ON swipes(to_dog_id);
CREATE INDEX IF NOT EXISTS idx_matches_dog1 ON matches(dog1_id);
CREATE INDEX IF NOT EXISTS idx_matches_dog2 ON matches(dog2_id);

-- Sample data (optional)
INSERT INTO users (email, password, name) VALUES 
('alice@example.com', '$2a$10$...', 'Alice'),
('bob@example.com', '$2a$10$...', 'Bob'),
('charlie@example.com', '$2a$10$...', 'Charlie'),
('diana@example.com', '$2a$10$...', 'Diana'),
('ethan@example.com', '$2a$10$...', 'Ethan')
ON CONFLICT DO NOTHING;

INSERT INTO dogs (user_id, name, age, breed, bio, photo_url) VALUES
(1, 'Max', 3, 'Golden Retriever', 'Friendly and loves fetch!', 'https://images.unsplash.com/photo-1633722715463-d30628519d80?w=400'),
(2, 'Bella', 2, 'Labrador', 'Energetic and loves hiking', 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400'),
(3, 'Charlie', 5, 'German Shepherd', 'Calm and loves cuddles', 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400'),
(4, 'Luna', 4, 'Husky', 'Playful and loves snow', 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400'),
(5, 'Cooper', 6, 'Border Collie', 'Smart and loves frisbee', 'https://images.unsplash.com/photo-1558591610-d4baf3b2adb2?w=400'),
(1, 'Daisy', 3, 'Beagle', 'Cute and loves treats', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'),
(2, 'Rocky', 7, 'Rottweiler', 'Gentle giant', 'https://images.unsplash.com/photo-1608848461950-0fed8e7a70d8?w=400'),
(3, 'Scout', 2, 'Australian Shepherd', 'Adventurous spirit', 'https://images.unsplash.com/photo-1617895153857-82ec9d9b6d53?w=400')
ON CONFLICT DO NOTHING;
