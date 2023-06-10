CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  password TEXT NOT NULL,
  phone VARCHAR(10) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
  is_worker BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  body TEXT NOT NULL,
  status TEXT,
  address VARCHAR NOT NULL,
  posted_by INTEGER REFERENCES users (id) ON DELETE CASCADE,
  assigned_to INTEGER REFERENCES users (id) ON DELETE CASCADE,
  start_time TIMESTAMP DEFAULT null,
  end_time TIMESTAMP DEFAULT null,
  payment_due FLOAT,
  before_image_url TEXT,
  after_image_url TEXT
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  title VARCHAR,
  body VARCHAR,
  stars INTEGER,
  reviewed_by INTEGER REFERENCES users (id) ON DELETE CASCADE,
  reviewed_for INTEGER REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  body VARCHAR NOT NULL,
  sent_by INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  sent_to INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at TIMESTAMP
);

CREATE TABLE conversations (
  id TEXT PRIMARY KEY
);

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  applied_by INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  applied_to INTEGER NOT NULL REFERENCES jobs (id) ON DELETE CASCADE
);

CREATE TABLE payouts (
  id SERIAL PRIMARY KEY,
  trans_by INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  trans_for INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subtotal FLOAT NOT NULL,
  tax FLOAT NOT NULL,
  tip FLOAT DEFAULT null,
  total FLOAT NOT NULL
);
