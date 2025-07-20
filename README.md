# Movie Recommendation App

A full-stack movie recommendation application built with Next.js (React), Express.js, MongoDB, and integrated with The Movie Database (TMDB) API.

## Tech Stack

### Frontend

- Next.js 14+ with App Router
- React.js with modern hooks and Server Components
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for API calls
- Next.js built-in state management

### Backend

- Express.js for RESTful API
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS and middleware setup

### External APIs

- The Movie Database (TMDB) API for movie data

## Project Structure

```
movie-recommendation-app/
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── app.ts               # Main application entry point
├── backend/             # Express.js backend API
│   ├── config/          # Database & API configurations
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose MongoDB schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic & external APIs
│   ├── tests/           # API tests
│   └── utils/           # Helper functions
├── docs/                # Documentation
│   ├── API.md           # API documentation
│   ├── DEVELOPMENT.md   # Development guide
│   └── PLATFORM_DEPLOYMENT.md # Vercel & Render deployment guide
├── frontend/            # Next.js frontend application
│   ├── eslint.config.mjs # ESLint configuration
│   ├── next-env.d.ts    # Next.js TypeScript declarations
│   ├── next.config.ts   # Next.js configuration
│   ├── package.json     # Frontend dependencies
│   ├── postcss.config.mjs # PostCSS configuration
│   ├── public/          # Static assets
│   ├── README.md        # Frontend-specific documentation
│   ├── src/             # Source code
│   │   ├── app/         # Next.js App Router pages
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility libraries and configurations
│   │   ├── services/    # API service calls
│   │   └── types/       # TypeScript type definitions
│   └── tsconfig.json    # TypeScript configuration
├── package.json         # Root package configuration
├── README.md            # Main project documentation
├── server.ts            # Server entry point
└── shared/              # Shared utilities and types
    ├── constants/       # Shared constants
    ├── types/           # TypeScript definitions
    └── validation/      # Validation schemas
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- TMDB API Key

### Quick Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd movie-recommendation-app
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Environment Setup**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Add your API keys and database URL to .env
   ```

4. **Start Development Servers**

   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start individually:
   # npm run dev:frontend  # Next.js app on http://localhost:3000
   # npm run dev:backend   # Express API server on http://localhost:5000
   ```

### Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com)
- **Backend**: Deploy to [Render](https://render.com)
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/atlas)

## Core Features

### 1. User Authentication

- User registration and login
- Secure password handling
- JWT token-based authentication

### 2. Movie Discovery

- Search movies by title, genre, or year
- Filter by rating, release date, and popularity
- View detailed movie information
- Get personalized recommendations based on user preferences

### 3. User Features

- Save favorite movies
- Create custom watchlists
- Rate and review movies
- User profile management

## API Documentation

- Authentication endpoints
- Movie endpoints
- User management endpoints
- Recommendation endpoints

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
