# MockAI - AI-Powered Interview Practice Platform

MockAI is an intelligent interview preparation platform that helps candidates practice and improve their interview skills using AI-powered mock interviews. Get instant feedback, track your progress, and ace your next interview with confidence.

## ✨ Features

### 🎯 Core Features
- **AI-Generated Questions**: Get industry-relevant interview questions tailored to your role, experience level, and tech stack
- **Real-Time Feedback**: Receive instant, constructive feedback on your answers using Google Gemini AI
- **Speech Recognition**: Practice speaking your answers with built-in speech-to-text functionality
- **Progress Tracking**: Monitor your improvement over time with detailed performance analytics
- **Video Practice**: Enable webcam for realistic interview simulation
- **Personalized Interviews**: Customize difficulty level, role, and technology stack

### 🔐 User Management
- Email/Password Authentication
- Google Sign-In Integration
- User Profile Management
- Secure Session Handling

### 📊 Dashboard
- Create and manage multiple mock interviews
- View interview history
- Track completion status
- Quick access to feedback and results

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark theme with glassmorphism effects
- Smooth animations and transitions
- Intuitive navigation

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **NextUI** - React UI component library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend & Services
- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
- **Google Generative AI (Gemini 2.5)** - AI-powered question generation and feedback
- **React Speech Recognition** - Voice input functionality

### Additional Libraries
- React Toastify - Toast notifications
- Canvas Confetti - Celebration effects
- Recharts - Data visualization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase Account** with a project set up
- **Google AI Studio API Key** (Gemini API)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Mock-AI.git
cd Mock-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add your environment variables:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Firebase Configuration

Update your Firebase configuration in `src/firebase.js`:

```javascript
const firebaseConfig = {
    apiKey: "your_firebase_api_key",
    authDomain: "your_project.firebaseapp.com",
    projectId: "your_project_id",
    storageBucket: "your_project.appspot.com",
    messagingSenderId: "your_sender_id",
    appId: "your_app_id"
};
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

### 7. Preview Production Build

```bash
npm run preview
```



## 🔧 Configuration

### Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your `.env` file as `VITE_GEMINI_API_KEY`
4. The application uses Gemini 2.5 Flash model for optimal performance

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google Sign-In)
3. Create a Firestore Database
4. Add your Firebase configuration to `src/firebase.js`

## 🎮 Usage

### Creating Your First Mock Interview

1. **Sign Up / Login** - Create an account or sign in with Google
2. **Complete Profile** - Add your personal information
3. **Create Interview** - Click "Add New Interview" on the dashboard
4. **Configure Interview**:
   - Enter job role/position
   - Select difficulty level (Junior, Mid, Senior)
   - Add years of experience
   - Describe tech stack or job description
5. **Start Practice** - Grant camera/microphone permissions
6. **Answer Questions** - Respond to 5 AI-generated questions
7. **Review Feedback** - Get detailed feedback and scores

### Interview Tips

- **Prepare Examples**: Have specific examples ready from your experience
- **Practice Active Listening**: Read questions carefully before answering
- **Be Specific**: Provide detailed, relevant answers
- **Use the STAR Method**: Structure answers with Situation, Task, Action, Result
- **Review Feedback**: Learn from AI suggestions to improve

## 🔒 Security

- API keys are stored in environment variables (`.env`)
- `.env` is included in `.gitignore` to prevent exposure
- Firebase handles authentication securely
- User data is protected with Firestore security rules
- Never commit sensitive credentials to version control

## 📝 Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful AI capabilities
- Firebase for backend infrastructure
- Vite team for the amazing build tool
- React and the open-source community

## 📧 Contact

For questions or support, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ by KentasticDev**

© 2025 MockAI. Ace your interviews with confidence.
