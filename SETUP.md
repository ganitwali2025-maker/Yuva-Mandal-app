# Yuva Mandal App - Setup Guide

## 📋 Quick Setup (5 minutes)

### Option 1: Direct Browser Open (Offline)
1. Simply open `index.html` in your browser
2. The app works immediately without any installation

### Option 2: Using npm (Recommended for Development)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Or with auto-browser open
npm run dev
```

Then open `http://localhost:8000` in your browser.

---

## 🔌 Connect to Google Sheets (Optional)

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Yuva Mandal Data"

### Step 2: Set Up Apps Script Backend
1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Copy the entire content of `apps-script-backend.js` from this folder
4. Paste it into the Apps Script editor
5. Save the project (Ctrl+S)

### Step 3: Initialize Sheets
1. In Apps Script, click on **Select function** dropdown
2. Choose **initializeSheets**
3. Click the **Run** button (▶️)
4. Grant permissions when prompted
5. You should see "Sheets initialized successfully" in the logs

### Step 4: Deploy as Web App
1. In Apps Script, click **Deploy** (top right)
2. Click **New Deployment**
3. Choose **Type** → **Web app**
4. Set:
   - Execute as: Your email account
   - Who has access: Anyone
5. Click **Deploy**
6. Copy the deployment URL (the long URL)

### Step 5: Connect App to Sheet
1. Open the Yuva Mandal app
2. Go to **Settings (⚙️)** tab
3. Paste the Google Apps Script Web App URL in the last field
4. Click **"सेव करें और जोड़ें"** (Save & Connect)
5. You should see "Google Sheet से जुड़ा हुआ है" on the home page

---

## 📱 Using the App

### First Time Setup
1. Go to **Settings** and configure:
   - Mandal Name (your organization name)
   - Village/City name
   - Default monthly चंदा amount

### Add Members
1. Click **"नया सदस्य"** (New Member) or **"सदस्य सूची"** (Members)
2. Fill in member details
3. Click **"सदस्य सेव करें"**

### Record Contributions
1. Go to **"चंदा"** (Monthly Contribution)
2. Select member name
3. Fill in amount and month
4. Click **"चंदा दर्ज करें"**

### Track Expenses
1. Go to **"खर्च दर्ज"** (Expense)
2. Fill in category, description, amount
3. Click **"खर्च दर्ज करें"**

### View Reports
1. Go to **"रिपोर्ट"** (Reports)
2. Switch between tabs:
   - **सारांश** - Financial summary
   - **सदस्य** - Member list
   - **चंदा** - Contribution records
   - **सहयोग** - Donation records
   - **खर्च** - Expense records

---

## 🔄 Data Sync

### How Sync Works
- **Online**: Data automatically syncs with Google Sheet every action
- **Offline**: App saves to browser storage, syncs when connection restored
- **Manual**: Data always persists, even if sheet not connected

### Troubleshooting Sync Issues

**Problem: "Connection Error" status**
- Check internet connection
- Verify Google Apps Script URL is correct
- Re-deploy the Apps Script if changes were made

**Problem: Data not appearing in Sheet**
- Check that you're logged into the Google account in the browser
- Verify the Sheet has correct column headers
- Check Google Apps Script logs for errors

**Problem: Old data lost after sync**
- All data is backed up in browser storage
- Clear browser cache carefully (it deletes local data)

---

## 💾 Backup & Export

### Export Data
1. Go to **Reports** tab
2. For each tab (Members, Chanda, Sahyog, Expense):
   - Take screenshots or copy the table
   - Or copy from connected Google Sheet directly

### Backup Strategy
- **With Sheet**: Data auto-backs up to Google Drive
- **Offline**: Periodically export or note down important figures
- **Browser**: Don't clear storage/cache frequently

---

## 🛠️ Technical Details

### File Structure
```
Yuva Mandal App/
├── index.html                      # Main app file
├── package.json                    # npm configuration
├── apps-script-backend.js          # Google Apps Script code
├── README.md                       # Full documentation
├── SETUP.md                        # This file
└── .gitignore                      # Git ignore rules
```

### Dependencies
- **Runtime**: None (pure vanilla JavaScript)
- **Dev**: http-server (optional, for local serving)

### Browser Compatibility
- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- IE 11 ❌

### Data Storage
- LocalStorage (browser storage)
- Size limit: ~5-10 MB per domain
- Persists: Across browser sessions
- Cleared: When cache is cleared or storage is manually cleared

---

## ⚠️ Important Notes

1. **Offline First**: App prioritizes offline functionality
2. **No Cloud Vendor Lock-in**: Easy to export data from Google Sheets
3. **Privacy**: All data stored locally unless explicitly synced
4. **Multi-User**: Designed for one user; concurrent editing not recommended
5. **Mobile**: Optimized for mobile but works on desktop too

---

## 🆘 FAQ

**Q: Can multiple people use this simultaneously?**
A: No, sync is designed for single-user. For team use, each person should have their own deployment or use the Google Sheet directly.

**Q: Is my data secure?**
A: Data is stored locally on your device and in your Google Drive. Ensure your Google account is secure.

**Q: Can I delete the Google Apps Script later?**
A: Yes, the app works completely offline. Sheet sync is optional.

**Q: How do I transfer data between devices?**
A: Export from Google Sheets and import to the new device, or share the Google Sheet link.

**Q: Can I customize the app?**
A: Yes! Edit `index.html` to change colors, text, or functionality. No build process needed.

---

## 📞 Support

For issues:
1. Check browser console (F12 → Console) for errors
2. Verify all settings are correct
3. Try refreshing the page (Ctrl+R)
4. Check that you have internet for sheet sync
5. Clear browser cache if UI acts strange

---

**Enjoy managing your Mandal! 🚩**
