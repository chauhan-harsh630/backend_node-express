# 🚀 Git & GitHub Basic Commands (Daily Use)

This guide covers the **complete basic Git & GitHub workflow** used in day-to-day development.

---

## 📌 Complete Git Workflow (Start to Push)

### 1️⃣ Create a folder and move into it
```bash
C:\Desktop> mkdir folder-1
C:\Desktop> cd folder-1
```

### 2️⃣ Create a file inside the folder
```bash
C:\Desktop\folder-1> touch index.js
```

### 3️⃣ Initialize Git repository
```bash
C:\Desktop\folder-1> git init
```

### 4️⃣ Add files to staging area
```bash
C:\Desktop\folder-1> git add .
```

### 5️⃣ Commit your changes
```bash
C:\Desktop\folder-1> git commit -m "Initial commit"
```

### 6️⃣ Add remote GitHub repository
```bash
C:\Desktop\folder-1> git remote add origin https://github.com/username/repository-name.git
```

### 7️⃣ Verify remote connection
```bash
C:\Desktop\folder-1> git remote -v
```

### 8️⃣ Set main branch
```bash
C:\Desktop\folder-1> git branch -M main
```

### 9️⃣ Push code to GitHub
```bash
C:\Desktop\folder-1> git push -u origin main
```

---

## 🔁 Daily Git Command Flow

```bash
git add .                      # Working Directory → Staging Area
git commit -m "your message"   # Staging Area → Local Repository
git push                       # Local Repository → GitHub
```

---

## 🛠️ Essential Git Commands

### Check Status
```bash
git status                     # View current changes
```

### View Commit History
```bash
git log                        # Full commit history
git log --oneline              # Compact view
```

### Pull Latest Changes
```bash
git pull                       # Fetch + merge from remote
```

### Branch Operations
```bash
git branch                     # List branches
git branch branch-name         # Create new branch
git checkout branch-name       # Switch to branch
git checkout -b branch-name    # Create and switch
git merge branch-name          # Merge branch into current
```

### Undo Changes
```bash
git restore file-name          # Discard unstaged changes
git restore --staged file-name # Unstage files
git reset HEAD~1               # Undo last commit (keep changes)
```

---

## 💡 Pro Tips

- Always `git pull` before starting work
- Write meaningful commit messages
- Commit small, logical changes frequently
- Use `.gitignore` for files you don't want to track
- Never commit sensitive data (passwords, API keys)

---

## 📝 Common .gitignore Entries

```
node_modules/
.env
*.log
.DS_Store
dist/
build/
```

---

**Happy Coding! 🎯**