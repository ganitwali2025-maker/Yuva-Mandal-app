# Yuva Mandal App 🚩 (युवा मंडल)

A modern, bilingual (Hindi/English) community organization management app built with **React + Vite** for tracking members, monthly contributions (चंदा), donations (सहयोग), and expenses.

## Features

- **Member Management**: Add and track community members with ID cards
- **Monthly Contributions**: Record चंदा (monthly dues) from members
- **Donations & Support**: Log सहयोग (donations) and support received
- **Expense Tracking**: Record and categorize expenses
- **Financial Reports**: View summary reports and detailed tables
- **Google Sheets Integration**: Sync data with Google Sheets via Apps Script
- **Offline Support**: Works offline with localStorage fallback
- **Mobile-Friendly**: Responsive design optimized for phones
- **Modern Stack**: Built with React 18, Vite, React Router

## Tech Stack

- **Frontend**: React 18, React Router v6
- **Build Tool**: Vite 5
- **Styling**: CSS Variables with custom design system
- **State Management**: React Context API
- **Storage**: LocalStorage for offline support
- **Backend**: Google Apps Script (optional)
- **Bilingual**: Hindi (हिंदी) + English

## Project Structure

```
yuva-mandal-app/
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Router configuration
│   ├── index.css                   # Global styles & variables
│   │
│   ├── context/
│   │   └── AppContext.jsx          # Global state (DB, settings, connState)
│   │
│   ├── api/
│   │   └── backend.js              # Google Apps Script integration
│   │
│   ├── utils/
│   │   └── helpers.js              # Utility functions (fmt, initials, etc.)
│   │
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   └── StatusChip.jsx
│   │   ├── cards/                  # Card components
│   │   │   ├── BalanceCard.jsx
│   │   │   ├── ActivityRow.jsx
│   │   │   └── ServiceIcon.jsx
│   │   └── layout/                 # Layout components
│   │       ├── PageHeader.jsx
│   │       ├── BottomNav.jsx
│   │       └── Toast.jsx
│   │
│   ├── pages/                      # Page components
│   │   ├── Home.jsx
│   │   ├── Members.jsx
│   │   ├── AddMember.jsx
│   │   ├── IdCard.jsx
│   │   ├── Chanda.jsx
│   │   ├── Sahyog.jsx
│   │   ├── Expense.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   │
│   └── assets/                     # Images and icons
│
├── public/
│   └── assets/                     # Static assets
│
├── backend/
│   └── apps-script-backend.js      # Google Apps Script backend
│
├── index.html                      # Vite HTML template
├── vite.config.js                  # Vite configuration
├── .env                            # Environment variables
├── package.json                    # Dependencies
├── .eslintrc                       # ESLint configuration
└── .gitignore                      # Git ignore rules
```

## Installation

### Prerequisites
- Node.js 16+ (latest LTS recommended)
- npm or yarn

### Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   
   The app will open automatically at `http://localhost:5173`

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Configuration

### Environment Variables

Edit `.env` file to customize:
```env
VITE_APP_NAME=Yuva Mandal
VITE_STORAGE_KEY=yuva_mandal_settings_v1
VITE_CACHE_KEY=yuva_mandal_cache_v1
```

### App Settings

In the app, go to **Settings (⚙️)** to configure:
1. **Mandal Name** - Your organization name
2. **Village/City** - Location name
3. **Default Monthly Chanda Amount** - Default contribution amount
4. **Google Apps Script URL** - For sheet sync (optional)

## Google Sheets Integration

To connect with Google Sheets:

### 1. Create a Google Sheet
- Structure it with these sheet names: Members, Chanda, Sahyog, Expense

### 2. Set Up Apps Script
1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Copy content from `backend/apps-script-backend.js`
4. Paste into the Apps Script editor
5. Save the project (Ctrl+S)

### 3. Initialize Sheets
1. In Apps Script, select **initializeSheets** from function dropdown
2. Click **Run** button
3. Grant permissions when prompted

### 4. Deploy as Web App
1. Click **Deploy** → **New Deployment**
2. Choose **Web app** as type
3. Set "Execute as" to your email
4. Set "Who has access" to "Anyone"
5. Click **Deploy** and copy the URL

### 5. Connect to App
1. Open Yuva Mandal App → **Settings**
2. Paste the Google Apps Script URL
3. Click **सेव करें और जोड़ें** (Save & Connect)

## Development

### Project Setup
- All source files are in `src/`
- Components follow React best practices
- Global state managed via Context API
- LocalStorage persists data across sessions

### Adding New Features
1. Create page component in `src/pages/`
2. Create route in `src/App.jsx`
3. Add navigation link in `BottomNav` or appropriate component
4. Use `useApp()` hook to access global state

### Code Style
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to utils or hooks
- Follow existing naming conventions

### Component Example
```jsx
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/helpers';

export default function MyComponent() {
  const { db, settings, addRow, showToast } = useApp();
  // Component logic here
}
```

## Data Storage

- **Offline**: Data saved to browser's LocalStorage
- **Online**: Syncs with Google Sheets via Apps Script
- **Fallback**: Works offline even if connection is lost
- **Persistence**: All data persists across browser sessions

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Requires modern browser with ES6+ support

## Troubleshooting

### Not syncing with Google Sheets?
- Check Settings page connection status
- Verify Google Apps Script URL is correct
- Ensure you're logged into the Google account
- Check browser console for errors (F12)

### Data disappeared?
- Check LocalStorage in DevTools (F12 → Application)
- Data persists unless cache is explicitly cleared
- Never clear storage without backing up important data

### Offline Mode?
- App works automatically offline
- Manual sync triggered by settings changes
- Connection status shown in header

## Performance Tips

1. **Regular Backups**: Export data from Google Sheets periodically
2. **Clear Old Entries**: Archive completed months in Google Sheets
3. **Optimize Images**: Keep profile images small (if adding photo feature)
4. **Periodic Syncs**: Auto-sync happens on data entry

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm run build
# Then push to GitHub and connect to Vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag the dist/ folder to Netlify
```

### Self-Hosted
```bash
npm run build
# Copy dist/ folder to your web server
```

## License

MIT License - Feel free to modify and distribute

## Contributing

Pull requests welcome! Please follow existing code style and add tests for new features.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for error messages
3. Verify Google Apps Script deployment
4. Ensure all .env variables are set correctly

---

**Made with ❤️ for community organizations**

🚩 Yuva Mandal App - Community Management Made Simple

## Configuration

### Settings Page

In the app, go to **Settings (⚙️)** to configure:

1. **Mandal Name** - Your organization name
2. **Village/City** - Location name
3. **Default Monthly Chanda Amount** - Default contribution amount
4. **Google Apps Script URL** - For sheet sync (optional)

### Google Sheets Integration

To connect with Google Sheets:

1. Create a Google Sheet with the following columns:
   - **Members sheet**: ID, Name, Mobile, Village, JoinDate, Status
   - **Chanda sheet**: ID, MemberID, MemberName, Month, Year, Amount, Date, Mode
   - **Sahyog sheet**: ID, DonorName, Purpose, Amount, Date
   - **Expense sheet**: ID, Date, Category, Description, Amount, PaidTo

2. Go to **Extensions → Apps Script** in Google Sheets

3. Replace the default code with the backend script (to be provided)

4. Deploy as Web App:
   - Click "Deploy" → "New Deployment"
   - Type: "Web app"
   - Execute as: Your account
   - Who has access: Anyone
   - Copy the deployment URL

5. Paste the URL in app Settings

## Data Storage

- **Offline**: Data saved to browser's LocalStorage
- **Online**: Syncs with Google Sheets via Apps Script
- **Fallback**: Works offline even if connection is lost

## Navigation

- **Home**: Dashboard with balance and quick actions
- **Members (सदस्य)**: View and add members
- **Chanda (चंदा)**: Record monthly contributions
- **Sahyog**: Record donations and support
- **Expense**: Log expenses
- **Reports (रिपोर्ट)**: View financial summary and data tables
- **Settings (सेटिंग)**: Configure app and connect Google Sheet

## Languages

The app is fully bilingual:
- Hindi (हिंदी) - Primary interface language
- English - Labels and secondary text

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

## Tips

1. **Regular Backups**: Export data from Google Sheets periodically
2. **Offline Work**: App works fully offline; syncs when connection restored
3. **ID Cards**: Print member ID cards from the Member page
4. **Reports**: Use Reports tab for financial audits and summaries

## Troubleshooting

**Not syncing with Google Sheets?**
- Check Settings page connection status
- Verify Google Apps Script URL is correct
- Ensure CORS is properly configured in Apps Script

**Data disappeared?**
- Check LocalStorage in browser DevTools (F12)
- Data persists across sessions unless cache is cleared

**Offline Mode?**
- App works offline automatically
- Manual sync option available in Settings

## License

MIT License - Feel free to modify and distribute

## Support

For issues or feature requests, please document them clearly with steps to reproduce.

---

**Made with ❤️ for community organizations**
