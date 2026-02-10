# Day-8: MongoDB Basics

**Status:** ✅ Completed  
**Topic:** MongoDB Installation & Core Operations  
**Date:** Backend Development Journey

---

## What I Learned Today

### 1. MongoDB Installation & Setup

**Installed Components:**
- MongoDB Community Server (v8.2.4)
- MongoDB Shell - mongosh (v2.6.0)
- MongoDB Compass (GUI)

**Key Distinction:**
- `mongod` → MongoDB Server (database engine)
- `mongosh` → MongoDB Shell (CLI interface)

**Installation Verification:**
```bash
mongod --version
mongosh --version
```

**Manual PATH Configuration:**
- Fixed Windows environment variables
- Added MongoDB binaries to system PATH

---

### 2. MongoDB Connection

**Local Connection:**
```bash
mongodb://localhost:27017
```

**Connection Verification:**
```javascript
db.runCommand({ ping: 1 })
// Response: { ok: 1 }
```

**Startup Warning (Expected):**
- Access control not enabled
- Normal for local development environment

---

### 3. Database & Collection Operations

**Database Creation:**
```javascript
use school
```

**Collection:** `students` (created implicitly on first insert)

**Document Structure:**
```javascript
{
  name: "Harsh",
  age: 20,
  gpa: 6.5
}
```

---

### 4. CRUD Operations Performed

**Create:**
```javascript
db.students.insertOne({ name: "Harsh", age: 20, gpa: 6.5 })
```

**Read:**
```javascript
db.students.find()
```

**Update:**
```javascript
db.students.updateOne({ name: "Harsh" }, { $set: { age: 21 } })
```

**Delete:**
```javascript
db.students.deleteOne({ name: "Harsh" })
```

---

## Core Concepts Understood

### NoSQL vs SQL
- Document-based storage vs table-based
- Flexible schema vs rigid structure
- Collections vs tables
- Documents vs rows

### MongoDB Fundamentals
- **Database** → Container for collections
- **Collection** → Group of documents (like a table)
- **Document** → Single record in JSON-like format (BSON)
- **ObjectId** → Unique `_id` auto-generated for each document
- **BSON Limit** → 16MB maximum document size

### Development Workflow
- Databases appear only after data insertion
- `admin` DB vs application databases
- MongoDB Compass = viewer; mongosh = source of truth
- Local development doesn't require authentication

---

## Tools Used

| Tool | Purpose |
|------|---------|
| MongoDB Community Server | Database engine |
| MongoDB Shell (mongosh) | CLI interface |
| MongoDB Compass | GUI database viewer |
| VS Code Terminal | Command execution |
| PowerShell | Windows shell operations |

---

## Key Takeaways

✅ MongoDB installation and environment setup on Windows  
✅ Understanding server vs shell architecture  
✅ Basic CRUD operations hands-on experience  
✅ Database/collection creation workflow  
✅ Document structure and ObjectId concept  
✅ Local development environment configuration  

---

## Resources

- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [MongoDB Shell Reference](https://www.mongodb.com/docs/mongodb-shell/)
- [CRUD Operations Guide](https://www.mongodb.com/docs/manual/crud/)

---

**Day-8 Completed ✓**