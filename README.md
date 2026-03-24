# ETHERMONY - AI Study Ecosystem

A professional, modular React application for AI-powered collaborative studying with real-time features.

## 📁 Project Structure

```
ethermony-2/
├── index.html              # Main HTML entry point (clean & minimal)
├── package.json            # Project dependencies & metadata
├── ETHERMONY.jpeg          # Logo asset
│
├── public/                 # Static assets
│
└── src/                    # Source code (modular structure)
    ├── index.jsx           # React entry point
    ├── App.jsx             # Main application component
    │
    ├── config/             # Configuration files
    │   ├── firebase.js      # Firebase configuration & exports
    │   └── constants.js     # App constants, settings, AI prompts
    │
    ├── utils/              # Utility functions
    │   └── ai.js           # AI generation, points system, helpers
    │
    ├── styles/             # Global styles
    │   └── globals.css     # CSS variables, animations, utilities
    │
    └── components/         # React components (organized by feature)
        ├── Icons.jsx       # SVG icon components
        ├── EthermonyLogo.jsx
        ├── ElegantShape.jsx
        ├── UI.jsx          # Toast, ThemeToggle
        ├── PomodoroTimer.jsx
        ├── SplineSceneBasic.jsx
        ├── AuthPage.jsx
        ├── Workspace.jsx
        │
        └── features/       # Feature-specific components
            ├── StudyChatFeature.jsx     # AI study modules
            ├── QuizInteractive.jsx      # Interactive quizzes
            ├── LeaderboardFeature.jsx   # Global rankings
            ├── StudyRoomsFeature.jsx    # Room lobby
            └── ActiveStudyRoom.jsx      # Live collaboration
```

## 🎯 Key Features

### 1. **AI Study Engine** (`StudyChatFeature`)
- Generate comprehensive study modules with:
  - AI-generated explanations
  - YouTube video suggestions
  - Interactive quizzes
- Points reward system
- Session management

### 2. **Collaborative Rooms** (`StudyRoomsFeature` & `ActiveStudyRoom`)
- Real-time chat with AI bot support (@ai mentions)
- Shared collaborative notes
- Excalidraw whiteboard integration
- Active member profiles

### 3. **Pomodoro Timer** (`PomodoroTimer`)
- 25-min focus / 5-min break cycles
- Harmony points rewards
- Real-time display

### 4. **Leaderboard** (`LeaderboardFeature`)
- Global ranking system
- Points tracking
- User profiles

### 5. **Authentication** (`AuthPage`)
- Email/password signup & login
- Google OAuth integration
- Phone number authentication with OTP

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Spline Viewer** - 3D graphics

### Backend
- **Firebase** - Authentication & Firestore database
- **Puter.js** - AI integration (primary)
- **Pollinations API** - AI fallback

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Firebase credentials are configured in `src/config/firebase.js`. Update with your project ID if needed.

### 3. Development Server
```bash
npm run dev
```
Or open `index.html` directly in a browser (uses CDN libraries).

### 4. Production Build
```bash
npm run build
```

## 🔧 Configuration Files

### `src/config/firebase.js`
- Firebase app initialization
- Authentication & Firestore imports
- Safe app ID handling

### `src/config/constants.js`
- Tailwind theme configuration
- AI prompt templates
- Points system values
- App metadata

### `src/utils/ai.js`
- `generateAIContent()` - Dual-engine AI (Puter → Pollinations fallback)
- `addHarmonyPoints()` - Points tracking
- `formatTime()` - Timestamp formatting
- `cn()` - Tailwind class utility

## 🎨 Component Organization

### Presentational Components
- `Icons.jsx` - Lightweight SVG components
- `UI.jsx` - Toast notifications, theme toggle
- `EthermonyLogo.jsx` - Branded logo component
- `ElegantShape.jsx` - Animated gradient shapes

### Feature Components
- **Study**: `StudyChatFeature` + `QuizInteractive`
- **Rooms**: `StudyRoomsFeature` + `ActiveStudyRoom`  
- **Leaderboard**: `LeaderboardFeature`

### Container Components
- `Workspace.jsx` - Main app layout & state
- `App.jsx` - Routing between home/auth/workspace
- `SplineSceneBasic.jsx` - Landing page with 3D animation
- `AuthPage.jsx` - Authentication flows

## 🎓 Key Design Patterns

### State Management
- Local component state (useState)
- Firebase real-time listeners (onSnapshot)
- Prop drilling for shared state

### AI Integration
- Primary: Puter.js (zero-config)
- Fallback: Pollinations API
- JSON mode for structured responses

### Real-time Features
- Firestore listeners for messages
- Collaborative notes auto-sync
- Leaderboard live updates

### Styling
- Tailwind utility-first CSS
- Dark mode with `dark:` prefix
- CSS animations in globals.css
- Glass morphism effects

## 📚 Code Quality

- **Modular** - Each component has single responsibility
- **Reusable** - Shared utilities & constants
- **Organized** - Clear folder structure
- **DRY** - No duplicate code
- **Professional** - Type hints in comments
- **Accessible** - Semantic HTML, ARIA labels

## 🚀 Deployment

### Option 1: Static Hosting (Firebase, Vercel, Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Option 2: Development Server
```bash
npm run dev
# Runs on localhost:5173
```

### Option 3: CDN-Only (Current)
Open `index.html` directly - uses all CDN libraries.

## 🔐 Security Notes

- Firebase config is public (web app)
- RecaptchaVerifier for phone auth
- Server-side validation recommended for production
- Secure your Firebase rules

## 📞 Support & Debugging

### Common Issues

**"Firebase Initialization Failed"**
- Check Firebase config in `src/config/firebase.js`
- Ensure domain is whitelisted in Firebase Console

**"AI API Failed"**
- Check Puter.js & Pollinations API availability
- Verify internet connection
- Check browser console for errors

**"Points Not Saving"**
- Verify user auth state
- Check Firestore rules
- Local mode fallback is enabled

## 📖 Additional Documentation

See individual component files for detailed JSDoc comments and usage examples.

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-24  
**License**: MIT
