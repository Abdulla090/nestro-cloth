# Nestro Cloth - AI-Powered Fashion Companion

An intelligent fashion app that helps you create perfect outfit combinations using AI. Built with React, TypeScript, and modern web technologies.

## ✨ Features

- **🎯 Tinder-Style Outfit Selection**: Swipe through AI-generated outfit combinations
- **🤖 AI-Powered Suggestions**: Smart outfit matching using Google Gemini AI
- **👕 Digital Closet Management**: Upload and organize your clothing items
- **📱 Mobile-First Design**: Optimized for mobile devices with responsive UI
- **🎨 Modern Interface**: Beautiful UI built with Tailwind CSS and ShadCN components
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm installed
- Get a Google Gemini API key from [Google AI Studio](https://ai.google.dev/aistudio)

### Installation

```bash
# Clone the repository
git clone https://github.com/Abdulla090/nestro-cloth.git

# Navigate to project directory
cd nestro-cloth

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env file and add your API keys
# VITE_GEMINI_API_KEY=your_actual_api_key_here

# Start development server
npm run dev
```

## 🔧 Environment Configuration

Create a `.env` file in the root directory and add your API keys:

```env
# Google Gemini API Key (Required)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (Optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**⚠️ Security Note**: Never commit your `.env` file to version control. The `.env.example` file is provided as a template.

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, ShadCN/UI Components
- **Animation**: Framer Motion
- **AI Integration**: Google Gemini API
- **Image Processing**: Background removal API
- **Routing**: React Router
- **State Management**: React Context

## 📱 Mobile Optimizations

- Compact layouts with reduced spacing
- Touch-friendly interface elements
- Smooth swipe animations
- Efficient screen space usage
- Responsive navigation

## 🎯 Key Pages

1. **Home**: Main landing page with navigation
2. **My Closet**: Upload and manage clothing items
3. **Suggestions**: AI-generated outfit combinations
4. **Today's Outfit**: Tinder-style swipe interface
5. **AI Chat**: Fashion advice chatbot

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔒 Security

This project follows security best practices:
- API keys are stored in environment variables
- Sensitive data is not committed to version control
- Input validation and sanitization
- Secure API communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎨 Screenshots

*Coming soon - Upload screenshots of the app in action*

## 🔮 Roadmap

- [x] AI Style Assistant Chat
- [ ] Weather-based outfit suggestions
- [ ] Social sharing features
- [ ] Outfit calendar planning
- [ ] Color palette analysis
- [ ] Brand recognition

---

Built with ❤️ by [Abdulla090](https://github.com/Abdulla090)
