# Task Manager Application

A modern, full-stack task management application built with Next.js, TypeScript, Prisma, and AI-powered features.

## ✨ Features

- **Task Management**: Create, read, update, and delete tasks
- **User Management**: Admin and user role-based access control
- **AI-Powered Summaries**: Intelligent task analysis and summaries
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: Secure login and registration with NextAuth
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Updates**: Live task status updates
- **Mobile Responsive**: Works perfectly on all devices

## 🤖 AI Features

The application includes smart AI capabilities with dual service support:

### Production (Vercel)
- **Primary**: OpenAI GPT-3.5-turbo for intelligent task analysis
- **Fallback**: Rule-based system for reliability

### Development (Local)
- **Primary**: Ollama with TinyLlama for free local testing
- **Fallback**: Rule-based system for reliability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (for production)
- Ollama (optional, for development)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd task-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/          # Dashboard pages
│   ├── login/             # Login page
│   ├── register/           # Registration page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── tasks/             # Task-related components
│   ├── users/             # User-related components
│   └── admin/            # Admin components
├── lib/                  # Utility libraries
│   ├── ai-service.ts      # Unified AI service
│   ├── openai-ai.ts      # OpenAI integration
│   ├── ollama-ai.ts      # Ollama integration
│   └── auth.ts           # Authentication configuration
└── prisma/               # Database schema and migrations
```

## 🗄️ Database Setup

### Option 1: Neon (Recommended)
1. Create a free account at [Neon](https://neon.tech)
2. Create a new PostgreSQL database
3. Copy the connection string to `DATABASE_URL`

### Option 2: Supabase
1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

### Option 3: Local PostgreSQL
```bash
# Install PostgreSQL
# Create database
createdb task_manager
# Update DATABASE_URL in .env
DATABASE_URL="postgresql://username:password@localhost:5432/task_manager"
```

## 🔐 Authentication

The application uses NextAuth.js for secure authentication:

- **Email/Password**: Traditional login method
- **Session Management**: Secure session handling
- **Role-Based Access**: Admin and user permissions
- **Protected Routes**: Route-level access control

## 🎨 UI Components

Built with modern, accessible components:

- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Ready for theme switching

## 🤖 AI Integration

### OpenAI Setup (Production)
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to environment variables:
```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### Ollama Setup (Development)
1. [Install Ollama](https://ollama.ai)
2. Pull TinyLlama model:
```bash
ollama pull tinyllama
```
3. Start Ollama server:
```bash
ollama serve
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Prepare for deployment**
```bash
# Install dependencies
npm install

# Build the application
npm run build
```

2. **Deploy to Vercel**
- Connect your GitHub repository to Vercel
- Add environment variables in Vercel dashboard
- Deploy automatically on push to main branch

3. **Required Environment Variables**
```bash
DATABASE_URL=your-postgres-connection-string
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-app-name.vercel.app
OPENAI_API_KEY=sk-your-openai-api-key
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📱 Features Overview

### Task Management
- ✅ Create tasks with title and description
- ✅ Set priority levels (Low, Medium, High)
- ✅ Track task status (Todo, In Progress, Done)
- ✅ Assign tasks to users
- ✅ Set due dates
- ✅ Edit and delete tasks

### User Management
- ✅ User registration and login
- ✅ Admin and user roles
- ✅ User profile management
- ✅ Task assignment capabilities

### AI Features
- ✅ Automatic task summarization
- ✅ Key action point extraction
- ✅ Time estimation
- ✅ Priority recommendations
- ✅ Description improvement suggestions

### UI/UX
- ✅ Modern, clean interface
- ✅ Smooth animations and transitions
- ✅ Responsive design for all devices
- ✅ Interactive components
- ✅ Loading states and error handling

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Commands

```bash
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema to database
npx prisma studio     # Open Prisma Studio
```

## 🧪 Testing

The application includes comprehensive testing:

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API route testing
- **E2E Tests**: Full user journey testing
- **AI Service Testing**: Mock AI responses for testing

## 📊 Monitoring & Analytics

### Production Monitoring
- **Vercel Analytics**: Performance and usage metrics
- **Error Tracking**: Automatic error logging
- **AI Usage**: OpenAI API usage monitoring

### Development Tools
- **Hot Reload**: Fast development iteration
- **TypeScript**: Type safety and IDE support
- **ESLint**: Code quality and consistency

## 🔧 Configuration

### Environment Variables

See `.env.example` for all required environment variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI API (Production)
OPENAI_API_KEY="your-openai-api-key-here"

# Ollama URL (Development)
OLLAMA_BASE_URL="http://localhost:11434"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
