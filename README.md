# 🐕 DogMatch

A dog-matching application where pet owners create profiles for their dogs and find compatible matches based on swiping. Like Bumble, but for dogs.

## Features

- **User Accounts**: Register and login with JWT authentication
- **Dog Profiles**: Create detailed profiles for your dog (name, age, breed, bio, photo)
- **Swiping**: Swipe right (like) or left (pass) on other dogs — the dog card animates off-screen in the swipe direction before the next dog appears
- **Matches**: See mutual matches when both owners swipe right; the app tells you immediately when a swipe results in a new match
- **Match Management**: View and unmatch with other dogs
- **Search**: Filter dogs by breed and age range
- **Statistics**: Track swipes, matches, and likes received

## Tech Stack

- **Frontend**: React with CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 14+
- PostgreSQL 12+
- npm

## Installing PostgreSQL 12+

### macOS (Homebrew)
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Verify installation
psql --version
```

### Windows
1. Download installer from https://www.postgresql.org/download/windows/
2. Run the installer
3. Follow the setup wizard:
   - Choose installation directory
   - Set password for `postgres` user (remember this!)
   - Keep port as 5432
   - Select "Launch Stack Builder" (optional)
4. PostgreSQL starts automatically

Verify installation:
```bash
psql --version
```

### Default Credentials
```
User: postgres
Password: postgres (or what you set during install)
Host: localhost
Port: 5432
```

### Test Connection
```bash
# Connect to PostgreSQL
psql -U postgres

# If prompted for password, enter: postgres

# Inside psql, check version
\version

# List all databases
\l

# Exit
\q
```

### If You Get "psql: command not found"

**macOS:**
```bash
export PATH="/usr/local/opt/postgresql/bin:$PATH"
echo 'export PATH="/usr/local/opt/postgresql/bin:$PATH"' >> ~/.zshrc
```

**Windows:**
Add PostgreSQL to PATH manually:
- Open Environment Variables
- Add `C:\Program Files\PostgreSQL\15\bin` to PATH
- Restart terminal

---

## Installation & Setup

### 1. Database Setup

```bash
# Create the database
createdb dogmatch

# Load the schema
psql dogmatch < schema.sql

# Verify tables were created
psql dogmatch -c "\dt"
```

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials (if different from defaults)
# Default values in .env.example should work for local development

# Start the server
npm start
```

**Expected output:**
```
Server running on port 5000
```

Backend is available at: `http://localhost:5000`

### 3. Frontend Setup 
ONLY RUN THIS IF YOU DONT HAVE THE FOLDER DOGMATCH-FRONTEND
```bash
# Create a new React app (if you don't have one)
npx create-react-app dogmatch-frontend

# Copy the hardened files
cp App-HARDENED.jsx dogmatch-frontend/src/App.jsx
cp App-HARDENED.css dogmatch-frontend/src/App.css

# Navigate to frontend directory
cd dogmatch-frontend
```

```bash

# Start the development server
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view dogmatch-frontend in the browser at http://localhost:3000
```

Frontend is available at: `http://localhost:3000`

---

## Usage Walkthrough

### 1. Register an Account

1. Open `http://localhost:3000`
2. Click **Register**
3. Fill in:
   - Full Name
   - Email
   - Password
4. Click **Register**
5. You're automatically logged in and taken straight to the **Create Dog Profile** screen so you can set up your dog before you start swiping

### 2. Create Your Dog's Profile

1. Click **Profile** in the navigation
2. Fill in your dog's information:
   - **Name**: Your dog's name (required)
   - **Age**: Age in years (required, should be 0-30)
   - **Breed**: Dog breed (required)
   - **Bio**: Short description about your dog (optional)
   - **Photo URL**: Link to a dog photo (optional)
3. Click **Create Profile**
4. Your dog profile is created and saved

### 3. Swipe on Dogs

1. Click **Swipe** tab (default on login)
2. View a dog's profile card with:
   - Photo
   - Name, Age, Breed
   - Bio
3. Click **❤️ Like** to swipe right (interested)
4. Click **👎 Pass** to swipe left (not interested)
5. The next dog appears automatically

### 4. View Matches

1. Click **Matches** tab
2. See all dogs where both of you swiped right
3. Each match shows:
   - Dog's photo
   - Name, age, breed
   - Bio
4. Click **Unmatch** to remove a match

### 5. Update Your Profile

1. Click **Profile** tab
2. View your dog's current information
3. To update: Log out and create a new dog profile (or use the API)

### 6. Logout

1. Click **Logout** button
2. You're logged out and returned to login page

---

## API Reference

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 1
}
```

**Store the token** in localStorage or session for authenticated requests.

---

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 1
}
```

**Store the token** for future requests.

---

### Dog Profile Endpoints

All dog endpoints require authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

#### Get Dogs for Swiping
```
GET /api/dogs
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "name": "Max",
    "age": 3,
    "breed": "Golden Retriever",
    "bio": "Friendly and loves fetch!",
    "photo_url": "https://example.com/max.jpg"
  },
  {
    "id": 2,
    "user_id": 3,
    "name": "Bella",
    "age": 2,
    "breed": "Labrador",
    "bio": "Energetic and loves hiking"
  }
]
```

Returns up to 50 dogs available to swipe on, in random order. The queue excludes your own dog and any dog you have already swiped on (left or right), so a dog never appears in your queue twice.

---

#### Get Specific Dog
```
GET /api/dogs/:id
Authorization: Bearer <token>

Example: GET /api/dogs/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 2,
  "name": "Max",
  "age": 3,
  "breed": "Golden Retriever",
  "bio": "Friendly and loves fetch!",
  "photo_url": "https://example.com/max.jpg"
}
```

---

#### Create Dog Profile
```
POST /api/dogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Charlie",
  "age": 5,
  "breed": "German Shepherd",
  "bio": "Calm and loves cuddles",
  "photoUrl": "https://example.com/charlie.jpg"
}
```

**Response (201 Created):**
```json
{
  "id": 10,
  "user_id": 1,
  "name": "Charlie",
  "age": 5,
  "breed": "German Shepherd",
  "bio": "Calm and loves cuddles",
  "photo_url": "https://example.com/charlie.jpg"
}
```

---

#### Update Dog Profile
```
PUT /api/dogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Charlie",
  "age": 6,
  "breed": "German Shepherd",
  "bio": "Now 6 years old, still loves cuddles",
  "photoUrl": "https://example.com/charlie-new.jpg"
}
```

**Response (200 OK):**
```json
{
  "id": 10,
  "user_id": 1,
  "name": "Charlie",
  "age": 6,
  "breed": "German Shepherd",
  "bio": "Now 6 years old, still loves cuddles",
  "photo_url": "https://example.com/charlie-new.jpg"
}
```

---

### Swiping & Matching Endpoints

#### Record a Swipe
```
POST /api/swipes
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetDogId": 5,
  "direction": "right"
}
```

**Parameters:**
- `targetDogId`: ID of the dog you're swiping on
- `direction`: Either "left" (pass) or "right" (like)

**Response (200 OK):**
```json
{
  "swiped": true,
  "match": false
}
```

When this swipe completes a mutual right-swipe, the response sets `"match": true` (and includes the matched dog), so the client can show a match notification without re-fetching. A normal swipe returns `"match": false`.

---

#### Get Your Matches
```
GET /api/matches
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "dog1_id": 10,
    "dog2_id": 5,
    "created_at": "2024-01-15T10:30:00Z",
    "matched_dog_id": 5,
    "name": "Max",
    "age": 3,
    "breed": "Golden Retriever",
    "bio": "Friendly and loves fetch!",
    "photo_url": "https://example.com/max.jpg"
  }
]
```

Returns all dogs your dog has matched with (mutual right swipes).

---

#### Unmatch
```
DELETE /api/matches/:matchId
Authorization: Bearer <token>

Example: DELETE /api/matches/1
```

**Response (200 OK):**
```json
{
  "unmatched": true
}
```

---

### User Profile Endpoints

#### Get User Profile
```
GET /api/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "dog": {
    "id": 10,
    "name": "Charlie",
    "age": 5,
    "breed": "German Shepherd",
    "bio": "Calm and loves cuddles",
    "photo_url": "https://example.com/charlie.jpg"
  }
}
```

The profile response includes the authenticated user's dog under `dog` (or `null` if they haven't created one yet), so the Profile screen can display it without a second request.

---

#### Update User Profile
```
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "newuser@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Smith",
  "email": "newuser@example.com"
}
```

---

### Search Endpoints

#### Search Dogs by Breed
```
GET /api/dogs/search/breed/:breed
Authorization: Bearer <token>

Example: GET /api/dogs/search/breed/Retriever
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Max",
    "age": 3,
    "breed": "Golden Retriever",
    "bio": "Friendly and loves fetch!",
    "photo_url": "https://example.com/max.jpg"
  }
]
```

---

#### Filter Dogs by Age Range
```
GET /api/dogs/age/:minAge/:maxAge
Authorization: Bearer <token>

Example: GET /api/dogs/age/1/5
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Max",
    "age": 3,
    "breed": "Golden Retriever",
    "bio": "Friendly and loves fetch!"
  },
  {
    "id": 2,
    "name": "Bella",
    "age": 2,
    "breed": "Labrador",
    "bio": "Energetic pup"
  }
]
```

---

### Statistics Endpoint

#### Get Swipe Statistics
```
GET /api/stats
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "swipes": 25,
  "matches": 5,
  "likes_received": 8
}
```

**Statistics:**
- `swipes`: Total swipes you've made (left or right)
- `matches`: Number of mutual matches
- `likes_received`: Number of right swipes you've received from others

---

## Environment Variables

Create a `.env` file with these variables:

```env
# Database Configuration
DB_USER=postgres              # PostgreSQL username
DB_PASSWORD=postgres          # PostgreSQL password
DB_HOST=localhost             # Database host
DB_PORT=5432                  # PostgreSQL port
DB_NAME=dogmatch              # Database name

# Server Configuration
PORT=5000                     # Port to run server on
NODE_ENV=development          # Environment (development/production)

# JWT Configuration
JWT_SECRET=your_secret_key_here    # Secret key for JWT signing

# CORS Configuration
CORS_ORIGIN=http://localhost:3000  # Frontend URL for CORS
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,      -- bcrypt hashed
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Dogs Table
```sql
CREATE TABLE dogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  breed VARCHAR(255) NOT NULL,
  bio TEXT,
  photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Swipes Table
```sql
CREATE TABLE swipes (
  id SERIAL PRIMARY KEY,
  from_dog_id INTEGER NOT NULL REFERENCES dogs(id),
  to_dog_id INTEGER NOT NULL REFERENCES dogs(id),
  direction VARCHAR(10) NOT NULL,      -- 'left' or 'right'
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Matches Table
```sql
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  dog1_id INTEGER NOT NULL REFERENCES dogs(id),
  dog2_id INTEGER NOT NULL REFERENCES dogs(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Example Workflow

### Step 1: Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123",
    "name": "Alice"
  }'

# Response includes token
# Save this token for authenticated requests
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### Step 2: Create Dog Profile
```bash
curl -X POST http://localhost:5000/api/dogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Max",
    "age": 3,
    "breed": "Golden Retriever",
    "bio": "Friendly and loves playing fetch",
    "photoUrl": "https://example.com/max.jpg"
  }'
```

### Step 3: Get Dogs to Swipe On
```bash
curl -X GET http://localhost:5000/api/dogs \
  -H "Authorization: Bearer $TOKEN"
```

### Step 4: Swipe Right on a Dog
```bash
curl -X POST http://localhost:5000/api/swipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "targetDogId": 5,
    "direction": "right"
  }'
```

### Step 5: Check Matches
```bash
curl -X GET http://localhost:5000/api/matches \
  -H "Authorization: Bearer $TOKEN"
```

---

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running: `pg_isready`
- Verify database exists: `psql -l | grep dogmatch`
- Check DB credentials in `.env` file
- Ensure port 5432 is accessible

### "Port 5000 already in use"
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env to 5001
```

### "CORS error in browser"
- Check CORS_ORIGIN in `.env` matches frontend URL
- Default: `http://localhost:3000`
- Make sure frontend is running on that port

### "Authentication failed"
- Verify token is being sent in `Authorization` header
- Format should be: `Authorization: Bearer <token>`
- Tokens expire after 24 hours, login again if needed

### "Dog not appearing in swipes"
- Your own dog is filtered out
- Other users' dogs appear in random order
- Make sure other users have created dog profiles

---

## License

MIT
