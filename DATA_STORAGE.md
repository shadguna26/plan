# Data Storage Guide

This document explains where all data is stored in the Feedback Intelligence Dashboard application.

## 📁 Storage Locations

All data is stored in **file-based JSON storage** (no database required). All files are located in the `server/data/` directory.

### Storage Directory Structure

```
server/
├── data/
│   ├── users.json          # User accounts and authentication data
│   └── analyses.json       # Historical feedback analysis results
└── uploads/                # Temporary CSV file uploads (auto-deleted)
```

---

## 📊 Data Files

### 1. **User Data** (`server/data/users.json`)

**Location:** `server/data/users.json`

**Contains:**
- User account information
- Hashed passwords (using bcryptjs)
- User IDs, emails, names
- Account creation timestamps

**Example Structure:**
```json
[
  {
    "id": "1234567890",
    "email": "email.com",
    "password": "$2a$10$hashedpassword...",
    "name": "Enter Name ",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Security:**
- Passwords are hashed using bcryptjs (never stored in plain text)
- File is created automatically on first user registration
- Each user has a unique ID

**Access:**
- Created/updated via `/api/auth/register` endpoint
- Read via `/api/auth/login` endpoint
- Managed by `server/authService.js`

---

### 2. **Analysis Data** (`server/data/analyses.json`)

**Location:** `server/data/analyses.json`

**Contains:**
- Historical feedback analysis results
- Sentiment data
- Category analysis
- Executive summaries
- Timestamps for each analysis

**Example Structure:**
```json
[
  {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "overall_sentiment": {
      "positive": 45,
      "neutral": 30,
      "negative": 25
    },
    "category_analysis": [
      {
        "category": "Product Quality",
        "sentiment": "positive",
        "score": 75,
        "mentions": 5
      }
    ],
    "summary": "Executive summary text..."
  }
]
```

**Features:**
- Stores up to **50 most recent analyses** (older ones are automatically removed)
- Used for trend detection (comparing current vs. historical data)
- Created automatically on each feedback analysis
- File is created automatically on first analysis

**Access:**
- Created via `/analyze-feedback` and `/upload-csv` endpoints
- Read via trend detection logic
- Managed by `server/storageService.js`

---

### 3. **Temporary Uploads** (`server/uploads/`)

**Location:** `server/uploads/` (temporary directory)

**Contains:**
- CSV files uploaded from Google Forms
- **Automatically deleted** after processing

**Process:**
1. User uploads CSV file
2. File is temporarily stored in `uploads/` directory
3. File is parsed and processed
4. File is **automatically deleted** after analysis completes
5. Analysis results are stored in `analyses.json`

**Note:** This directory is for temporary storage only. Files are cleaned up immediately after processing.

---

## 🔐 Security & Privacy

### Data Protection

1. **Passwords:**
   - Never stored in plain text
   - Hashed using bcryptjs (industry standard)
   - Cannot be recovered (only reset)

2. **JWT Tokens:**
   - Stored in browser localStorage (client-side)
   - Expire after 7 days
   - Required for accessing protected endpoints

3. **File Permissions:**
   - Data files are stored server-side only
   - Not accessible via web browser
   - Protected by server authentication

### Data Privacy

- All data is stored locally on your server
- No external database or cloud storage
- No data is sent to third parties (except Google Gemini API for analysis)
- Users can only access their own analysis history

---

## 📈 Data Management

### Automatic Cleanup

1. **Analysis History:**
   - Automatically limited to 50 most recent analyses
   - Older analyses are removed to prevent file growth

2. **CSV Uploads:**
   - Automatically deleted after processing
   - No manual cleanup required

### Manual Data Management

If you need to clear data:

**Clear All Analyses:**
```javascript
// Use the clearAnalyses() function in storageService.js
// Or manually delete server/data/analyses.json
```

**Clear All Users:**
```bash
# Manually delete server/data/users.json
# (Note: This will require all users to re-register)
```

**Clear Temporary Uploads:**
```bash
# Manually delete files in server/uploads/
# (Usually not needed as files auto-delete)
```

---

## 🔄 Data Flow

### User Registration Flow
```
User Registration
    ↓
Create user object
    ↓
Hash password (bcryptjs)
    ↓
Save to server/data/users.json
    ↓
Generate JWT token
    ↓
Return token to client
```

### Analysis Flow
```
User submits feedback
    ↓
Analyze with AI (Google Gemini)
    ↓
Store result in server/data/analyses.json
    ↓
Compare with historical data (trend detection)
    ↓
Return analysis to user
```

### CSV Upload Flow
```
User uploads CSV
    ↓
Save to server/uploads/ (temporary)
    ↓
Parse CSV file
    ↓
Extract text data
    ↓
Analyze with AI
    ↓
Delete temporary CSV file
    ↓
Store analysis in server/data/analyses.json
```

---

## 💾 Backup Recommendations

Since all data is stored in JSON files, backing up is simple:

1. **Backup the entire `server/data/` directory:**
   ```bash
   # Copy the directory
   cp -r server/data/ backup/data-$(date +%Y%m%d)/
   ```

2. **Backup specific files:**
   ```bash
   # Backup users
   cp server/data/users.json backup/users-backup.json
   
   # Backup analyses
   cp server/data/analyses.json backup/analyses-backup.json
   ```

3. **Automated Backup (recommended):**
   - Set up a cron job or scheduled task
   - Backup `server/data/` directory daily
   - Keep multiple backup versions

---

## 🚀 Migration to Database (Future)

If you need to scale or use a database:

**Current:** File-based JSON storage
**Future Options:**
- MongoDB
- PostgreSQL
- MySQL
- SQLite

**Migration Steps:**
1. Create database schema
2. Export JSON data
3. Import to database
4. Update `authService.js` and `storageService.js`
5. Replace file operations with database queries

---

## 📝 Notes

- **No Database Required:** This application uses file-based storage for simplicity
- **Auto-Creation:** All data files and directories are created automatically
- **JSON Format:** All data is stored in human-readable JSON format
- **Local Storage:** All data stays on your server (no cloud storage)
- **Scalability:** For production with many users, consider migrating to a database

---

## 🔍 File Locations Summary

| Data Type | File Path | Auto-Created | Auto-Cleaned |
|-----------|-----------|--------------|-------------|
| User Accounts | `server/data/users.json` | ✅ Yes | ❌ No |
| Analysis History | `server/data/analyses.json` | ✅ Yes | ✅ Yes (keeps last 50) |
| CSV Uploads | `server/uploads/*.csv` | ✅ Yes | ✅ Yes (after processing) |

---

**Last Updated:** 2024
**Storage Type:** File-based JSON
**Database:** None (file-based storage)


