# Quick Start Guide - Yuva Mandal App (React + Vite)

## ⚡ 5-Minute Setup

### Prerequisites
- **Node.js 16+** ([Download](https://nodejs.org/))
- A code editor (VS Code recommended)
- Modern web browser

### Installation & Running

```bash
# 1. Navigate to project folder
cd "Yuva Mandal App"

# 2. Install dependencies (first time only)
npm install

# 3. Start development server
npm run dev
```

The app will automatically open at **http://localhost:5173**

## 🎯 First Steps

### 1. Explore the App
- Open Home page to see dashboard
- Try adding a member (Members → + सदस्य जोड़ें)
- Record a chanda entry (चंदा tab)
- Check reports

### 2. Configure Settings
1. Click **सेटिंग** (Settings) in bottom navigation
2. Update:
   - Mandal Name (आपकी संस्था का नाम)
   - Village/City (गाँव / शहर)
   - Default monthly amount (डिफ़ॉल्ट राशि)
3. Click **सेव करें** (Save)

### 3. Connect Google Sheets (Optional)

**Create a Google Sheet:**
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new spreadsheet
3. Name it "Yuva Mandal Data"

**Setup Backend:**
1. In Google Sheet: **Extensions → Apps Script**
2. Copy code from `backend/apps-script-backend.js`
3. Paste into Apps Script editor
4. Select `initializeSheets` from dropdown
5. Click **Run** button
6. Grant permissions

**Deploy Web App:**
1. Click **Deploy** → **New Deployment**
2. Type: **Web app**
3. Execute as: Your email
4. Who has access: **Anyone**
5. Click **Deploy**
6. Copy the URL

**Connect in App:**
1. Open Yuva Mandal App → **सेटिंग** (Settings)
2. Paste Google Apps Script URL
3. Click **सेव करें और जोड़ें** (Save & Connect)
4. ✅ Status should show "Google Sheet से जुड़ा है"

## 📁 Project Structure at a Glance

```
src/
├── pages/          → Different screens/pages
├── components/     → Reusable building blocks
├── context/        → Global state & data
├── api/            → Backend integration
├── utils/          → Helper functions
└── index.css       → Global styling
```

**Key files to know:**
- `src/App.jsx` - Routes & app setup
- `src/context/AppContext.jsx` - Global data
- `src/pages/Home.jsx` - Home screen
- `src/index.css` - Design system

## 🛠️ Development Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code for errors
npm run lint
```

## 📱 Features Quick Reference

### Home
- Dashboard with balance
- Recent activity
- Quick action buttons
- Connection status

### Members (सदस्य)
- View all members
- Search by name/ID
- Add new member
- View member details & ID card
- Track member's paid chanda

### Monthly Chanda (चंदा)
- Record monthly contributions
- Select member & amount
- Payment method (Cash/UPI/Bank)
- View contribution history

### Donations (सहयोग)
- Track donations & support
- Record donor name & purpose
- Donation summary

### Expenses (खर्च)
- Record all expenses
- Categorize (Program/Stationery/Travel/etc.)
- Track who was paid
- Expense report

### Reports (रिपोर्ट)
- Financial summary (Summary tab)
- Detailed tables (Members/Chanda/Sahyog/Expense)
- Export-friendly format

### Settings (सेटिंग)
- Configure organization
- Set default amount
- Connect Google Sheets
- View connection status

## 💾 Data & Storage

### Local Storage
- All data automatically saved to browser
- No internet required
- Persists across sessions
- Can backup/restore manually

### Google Sheets Sync
- Automatic sync when connected
- Two-way sync (read & write)
- Cloud backup
- Share with team via Google

## 🔧 Customization

### Change Colors/Theme
Edit `src/index.css` CSS variables:
```css
:root {
  --navy-deep: #151966;
  --indigo: #463CC9;
  --saffron: #FF9A33;
  /* ... change as needed ... */
}
```

### Add New Form Fields
1. Find relevant page in `src/pages/`
2. Add Input component
3. Update the addRow() call
4. Update Google Sheet columns (if syncing)

### Modify Calculations
Edit `src/utils/helpers.js`:
- `calculateTotals()` - change balance formula
- `fmt()` - change currency format
- Add new helper functions as needed

## ⚠️ Common Issues

### "Port 5173 already in use"
```bash
# Kill existing process or use different port
# Edit vite.config.js:
server: { port: 3000 }
```

### "npm not found"
- Install Node.js from https://nodejs.org/
- Restart terminal after installation
- Verify: `node --version` and `npm --version`

### "Google Sheets not syncing"
- Verify URL is pasted correctly in Settings
- Check browser console (F12) for errors
- Ensure you're logged into Google account
- Re-deploy Apps Script if modified

### "Data disappeared"
- Check LocalStorage in DevTools (F12 → Application)
- Don't clear browser cache without backing up
- Restore from Google Sheet if connected

## 📦 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Click Deploy
5. Share the generated URL

### Deploy to Netlify
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag `dist/` folder
4. Done!

### Self-Hosted (VPS/Server)
1. Run `npm run build`
2. Upload `dist/` folder to server
3. Configure web server to serve `dist/index.html`
4. Point domain to server

## 📚 Learn More

- **React Basics**: https://react.dev
- **Vite Guide**: https://vitejs.dev/guide/
- **React Router**: https://reactrouter.com/
- **CSS Variables**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*

## 🆘 Need Help?

1. **Check Console**: Open DevTools (F12) → Console for error messages
2. **Read Docs**: Review MIGRATION_GUIDE.md and README.md
3. **Inspect Network**: Check API calls in DevTools → Network tab
4. **Review Code**: Check relevant component in `src/pages/`

## ✅ Checklist for First-Time Users

- [ ] Install Node.js
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Test adding a member
- [ ] Test recording chanda
- [ ] (Optional) Connect Google Sheets
- [ ] Explore all features
- [ ] Customize settings
- [ ] Deploy (when ready)

## 🚀 Ready to Use!

Your Yuva Mandal App is now set up and running. Start managing your community:

1. **Add Members** 👥
2. **Track Contributions** 💰
3. **Record Expenses** 📊
4. **View Reports** 📈

**Happy organizing! 🚩**

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Lint code | `npm run lint` |
| Install deps | `npm install` |

| Feature | Location |
|---------|----------|
| Pages | `src/pages/` |
| Components | `src/components/` |
| Global state | `src/context/AppContext.jsx` |
| Utilities | `src/utils/helpers.js` |
| Styles | `src/index.css` |
| Backend | `backend/apps-script-backend.js` |

---

For detailed information, see:
- 📖 **README.md** - Full documentation
- 🔄 **MIGRATION_GUIDE.md** - What changed from vanilla version
- 📋 **SETUP.md** - Original setup guide (still applies)
