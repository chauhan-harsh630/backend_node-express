# 🔐 JWT Authentication System (Node.js + Express + MongoDB)

A secure authentication system built using:

- Node.js
- Express.js
- MongoDB
- bcrypt (Password Hashing)
- JSON Web Token (JWT)

---

# 📌 Features

- User Signup
- User Login
- Password Hashing
- JWT Token Generation
- Protected Routes
- Token Verification Middleware

---

# 🏗 Project Structure

```
- models/
    user.model.js
- controllers/
    auth.controller.js
- middleware/
    auth.middleware.js
- routes/
    user.routes.js
- App.js
- .env
```

---

# 🚀 Installation

```bash
npm install express mongoose bcrypt jsonwebtoken dotenv
```

---

# ⚙ Environment Variables (.env)

```
PORT=5000
MONGO_DB=your_mongodb_connection_string
JWT_SECRET=your_super_long_random_secret_key
JWT_EXPIRES_IN=7d
```

Generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

# 🔑 JWT Deep Dive

## What is JWT?

JWT (JSON Web Token) is an open standard (RFC 7519) for securely transmitting information between parties as a compact, URL-safe string.

**Format:**
```
xxxxx.yyyyy.zzzzz
Header.Payload.Signature
```

---

## 🧱 JWT Structure

### 1. Header (Base64URL encoded)
Declares the token type and signing algorithm.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

| Field | Value     | Meaning                          |
|-------|-----------|----------------------------------|
| `alg` | `HS256`   | HMAC with SHA-256 (symmetric)    |
| `alg` | `RS256`   | RSA with SHA-256 (asymmetric)    |
| `typ` | `JWT`     | Token type                       |

---

### 2. Payload (Base64URL encoded)
Contains **claims** — statements about the user and metadata.

```json
{
  "sub": "64abc123",
  "username": "johndoe",
  "role": "admin",
  "iat": 1716230400,
  "exp": 1716835200
}
```

#### Standard (Registered) Claims

| Claim | Name       | Description                              |
|-------|------------|------------------------------------------|
| `iss` | Issuer     | Who issued the token (e.g. `"myapp"`)    |
| `sub` | Subject    | User ID the token refers to              |
| `aud` | Audience   | Who the token is intended for            |
| `exp` | Expiration | Unix timestamp — token invalid after this|
| `iat` | Issued At  | Unix timestamp — when it was created     |
| `nbf` | Not Before | Token not valid before this time         |
| `jti` | JWT ID     | Unique ID (useful for revocation)        |

> ⚠️ **Payload is NOT encrypted — only encoded.** Anyone can decode it. Never store passwords or sensitive data in the payload.

---

### 3. Signature
Prevents tampering. Created by signing the encoded header + payload with your secret.

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```

If anyone modifies the header or payload, the signature won't match — the server rejects it.

---

## 🔄 How JWT Works (Full Flow)

```
[Client]  POST /login { email, password }
    ↓
[Server]  Verify credentials
    ↓
[Server]  jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
    ↓
[Server]  Returns { token: "xxxxx.yyyyy.zzzzz" }
    ↓
[Client]  Stores token (localStorage or httpOnly cookie)
    ↓
[Client]  GET /protected — Authorization: Bearer <token>
    ↓
[Server]  jwt.verify(token, JWT_SECRET)
    ↓
[Server]  Decode payload → req.user = { userId, role }
    ↓
[Server]  Return protected resource
```

---

## 💻 Code Examples

### Sign a Token

```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user._id, role: user.role },  // payload
  process.env.JWT_SECRET,                 // secret
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // options
);
```

### Verify a Token

```javascript
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded); // { userId, role, iat, exp }
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    // Token has expired
  } else if (err.name === 'JsonWebTokenError') {
    // Token is invalid/tampered
  }
}
```

### Auth Middleware

```javascript
// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;
```

---

## ⏱ Token Expiration Best Practices

| Token Type      | Recommended Expiry | Storage Location              |
|-----------------|--------------------|-------------------------------|
| Access Token    | 15 min – 1 hour    | Memory or httpOnly cookie     |
| Refresh Token   | 7 – 30 days        | httpOnly cookie (secure only) |

**Why short-lived access tokens?**
JWTs are stateless — you can't "log out" a token mid-flight. A short expiry limits damage if a token is stolen.

---

## 🔄 Refresh Token Pattern

```
Access Token expires
    ↓
Client sends Refresh Token to /auth/refresh
    ↓
Server verifies Refresh Token (from DB or cookie)
    ↓
Server issues new Access Token
    ↓
Client continues with new token
```

---

## 🔐 HS256 vs RS256

| Feature        | HS256 (Symmetric)         | RS256 (Asymmetric)                        |
|----------------|---------------------------|-------------------------------------------|
| Keys           | One shared secret         | Public/Private key pair                   |
| Best for       | Single-server apps        | Microservices, third-party verification   |
| Verification   | Needs the secret key      | Can verify with public key (safe to share)|
| Risk           | Secret must stay private  | Private key must stay private             |

---

## 🚫 Common JWT Mistakes

| Mistake                             | Fix                                               |
|-------------------------------------|---------------------------------------------------|
| Storing sensitive data in payload   | Payload is encoded, not encrypted — keep it minimal |
| Using a weak or short JWT_SECRET    | Use 256-bit+ random secret                        |
| Not setting token expiration        | Always set `expiresIn`                            |
| Storing token in localStorage       | Use httpOnly cookies to prevent XSS attacks       |
| No token revocation strategy        | Use refresh token rotation or a token blocklist   |
| Using `none` algorithm              | Always explicitly specify and validate algorithm  |

---

## 🛡 Security Checklist

- [ ] JWT_SECRET is long, random, and stored in `.env`
- [ ] Tokens have `expiresIn` set
- [ ] Verify token on every protected route
- [ ] Use HTTPS in production (tokens in transit are vulnerable otherwise)
- [ ] Use `httpOnly` cookies for token storage where possible
- [ ] Implement refresh token rotation
- [ ] Handle `TokenExpiredError` and `JsonWebTokenError` separately

---

# 🔄 Complete Flow Diagram

```
Login
   ↓
Password Verified (bcrypt.compare)
   ↓
JWT Generated (Signed with JWT_SECRET)
   ↓
Token Sent to Client
   ↓
Client Stores Token
   ↓
Client Sends Authorization Header (Bearer <token>)
   ↓
Server Verifies Token (jwt.verify)
   ↓
Decode Payload → req.user
   ↓
Fetch User From Database (optional, if fresh data needed)
   ↓
Return Protected Resource
```

---

# 🎯 Summary

| Concept        | Details                                           |
|----------------|---------------------------------------------------|
| JWT Structure  | Header + Payload + Signature                      |
| JWT_SECRET     | Signs and verifies the token                      |
| Verification   | Signature matching — any change = rejection       |
| Stateless      | No session stored on server                       |
| Expiration     | `exp` claim — server rejects expired tokens       |
| Not encrypted  | Payload is Base64URL encoded, readable by anyone  |