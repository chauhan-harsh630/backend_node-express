# 📅 Day 22 – MongoDB Indexing & Query Optimization

## 🎯 Objective
Master MongoDB indexing, analyze query performance using `explain()`, understand `COLLSCAN vs IXSCAN`, and implement covered queries for backend performance optimization.

---

## 🗄️ 1. Database Setup

### Insert Single Document

```js
db.users.insertOne({
  name: "Harsh",
  email: "harsh123@gmail.com",
  age: 22,
  role: "user",
  createdAt: new Date()
})
```

### Insert Multiple Documents

```js
db.users.insertMany([
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    age: 24,
    role: "admin",
    createdAt: new Date()
  },
  {
    name: "Riya Verma",
    email: "riya.verma@gmail.com",
    age: 21,
    role: "user",
    createdAt: new Date()
  },
  {
    name: "Ananya Gupta",
    email: "ananya.gupta@gmail.com",
    age: 23,
    role: "admin",
    createdAt: new Date()
  }
])
```

---

## 🔍 2. Basic Queries

### Find All Users
```js
db.users.find()
```

### Find by Email
```js
db.users.find({ email: "riya.verma@gmail.com" })
```

### Find by Role
```js
db.users.find({ role: "admin" })
```

### Find with Condition
```js
db.users.find({ age: { $lt: 25 } })
db.users.find({ age: { $lte: 25 } })
```

---

## 📊 3. Performance Analysis (Before Index)

```js
db.users.find({ age: { $lte: 25 } }).explain("executionStats")
```

Look for:
- `stage: "COLLSCAN"`
- `totalDocsExamined`
- `executionTimeMillis`

---

## 🚀 4. Creating Indexes

### Single Field Index
```js
db.users.createIndex({ age: 1 })
db.users.createIndex({ email: 1 })
```

### Unique Index
```js
db.users.createIndex({ email: 1 }, { unique: true })
```

### Compound Index
```js
db.users.createIndex({ role: 1, age: 1 })
```

---

## 🔬 5. Performance After Index

```js
db.users.find({ age: { $lte: 25 } }).explain("executionStats")
```

Expected:
- `stage: "IXSCAN"`
- `totalDocsExamined ≈ nReturned`

---

## ⚡ 6. Covered Query (Advanced Optimization)

```js
db.users.find(
  { email: "riya.verma@gmail.com" },
  { email: 1, _id: 0 }
).explain("executionStats")
```

Expected Output:
- `stage: "PROJECTION_COVERED"`
- `totalDocsExamined: 0`
- `totalKeysExamined: 1`

> **Meaning:** MongoDB returned result directly from index without fetching the full document.

---

## 📈 7. COLLSCAN vs IXSCAN

| Feature | COLLSCAN | IXSCAN |
|---|---|---|
| Uses Index | ❌ No | ✅ Yes |
| Scans Full Collection | ✅ Yes | ❌ No |
| Performance (Large Data) | Slow | Fast |
| Production Ready | No | Yes |

---

## 🧠 8. Important Concepts Learned

### B-Tree Index
MongoDB stores indexes in B-Tree structure for fast lookup.

### FETCH Stage
If full document is required:
- MongoDB performs `IXSCAN`
- Then `FETCH` stage retrieves full document

> Covered queries remove the FETCH stage entirely.

### Prefix Rule (Compound Index)

If index is:
```js
{ role: 1, age: 1 }
```

✅ Efficient for:
```js
{ role: "admin" }
{ role: "admin", age: 25 }
```

❌ Not efficient for:
```js
{ age: 25 }
```

---

## 🎯 9. Key Performance Indicators

Good optimization looks like:
- `totalDocsExamined ≈ nReturned`
- No `COLLSCAN`
- No unnecessary `SORT` stage
- `totalDocsExamined = 0` (covered query)

---

## 🏆 Day 22 Outcome

Today I:
- Inserted structured dataset
- Created single field index
- Created unique index
- Created compound index
- Compared COLLSCAN vs IXSCAN
- Used `explain()` for performance debugging
- Implemented a covered query
- Understood prefix rule
- Learned how MongoDB uses B-Tree internally

---

✅ **Day 22 Complete – MongoDB Performance Engineering Level Up**