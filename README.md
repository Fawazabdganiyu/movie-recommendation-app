# Movie Recommendation App

A full-stack movie recommendation application built with Next.js (React), Express.js, MongoDB, and integrated with The Movie Database (TMDB) API.

## Tech Stack

### Frontend

- Next.js 14+ with App Router
- React.js with modern hooks and Server Components
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for API calls
- Zustand for state management

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
│   ├── README.md        # Backend-specific documentation
│   ├── src/             # Source code
│   │   ├── config/      # Database & API configurations
│   │   ├── container/   # Dependency injection container
│   │   ├── controllers/ # Route handlers
│   │   ├── docs/        # API documentation (Swagger/OpenAPI)
│   │   ├── errors/      # Custom error classes
│   │   ├── middleware/  # Auth, validation, error handling
│   │   ├── models/      # Mongoose MongoDB schemas
│   │   ├── repositories/# Data access layer
│   │   ├── routes/      # API route definitions
│   │   ├── services/    # Business logic & external APIs
│   │   ├── types/       # Backend-specific TypeScript types
│   │   ├── utils/       # Helper functions
│   │   └── validation/  # Zod validation schemas
│   ├── tests/           # API tests
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
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

## Architecture Overview

### Shared Code (`shared/`)

The `shared/` directory contains code and type definitions that are shared between the frontend (Next.js) and backend (Express.js) applications. This promotes code reuse and consistency across the project.

- **`shared/constants/`**: Contains shared constants used in both frontend and backend
- **`shared/types/`**: Contains TypeScript type definitions for data structures used throughout the application (API request/response types, user types, movie types, etc.)
- **`shared/validation/`**: Contains Zod validation schemas used for validating data on both frontend and backend

### Backend Architecture (`backend/src/`)

The backend follows a clean architecture pattern with separation of concerns:

- **`config/`**: Environment configuration, database connection, and external API settings
- **`container/`**: Dependency injection container for managing service instances
- **`controllers/`**: Handle HTTP requests and responses, orchestrate business logic
- **`errors/`**: Custom error classes extending a base `CustomError` class for structured error handling
- **`middleware/`**: Express middleware for authentication, validation, error handling, and request processing
- **`models/`**: Mongoose schemas defining MongoDB document structure
- **`repositories/`**: Data access layer abstracting database operations
- **`routes/`**: API route definitions with middleware integration
- **`services/`**: Business logic and external API integrations (TMDB, authentication, etc.)
- **`types/`**: Backend-specific TypeScript type definitions
- **`utils/`**: Helper functions and utilities
- **`validation/`**: Zod schemas for request validation

### Error Handling System

The backend implements a comprehensive error handling system:

- **Custom Error Classes**: Structured error types (`AuthenticationError`, `ValidationError`, `NotFoundError`, etc.)
- **Global Error Middleware**: Catches and formats all errors consistently
- **Zod Integration**: Automatic validation error formatting
- **External API Error Handling**: Graceful handling of TMDB API failures

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- TMDB API Key

### Quick Setup

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd movie-recommendation-app
    ```

2.  **Install dependencies**

    ```bash
    npm run install:all
    ```

3.  **Environment Setup**

    ```bash
    # Copy environment template
    cp .env.example backend/.env

    # Add your TMDB API key and database URL to .env
    cp frontend/.env.example frontend/.env.local
    # Update NEXT_PUBLIC_API_URL to local backend URL
    ```

4.  **Start Development Servers**

    ```bash
    # Start both frontend and backend
    npm run dev

    # Or start individually:
    npm run dev:frontend  # Next.js app on http://localhost:3000
    npm run dev:backend   # Express API server on http://localhost:5000
    ```

### Deployment

-   **Frontend**: Deploy to [Vercel](https://vercel.com)
-   **Backend**: Deploy to [Render](https://render.com)
-   **Database**: Use [MongoDB Atlas](https://www.mongodb.com/atlas)

## Core Features

### 1. User Authentication

-   User registration and login
-   Secure password handling
-   JWT token-based authentication
-   Email verification and password reset
-   Role-based access control (prepared for future implementation)

### 2. Movie Discovery

-   Search movies by title, genre, or year
-   Filter by rating, release date, and popularity
-   View detailed movie information
-   Get personalized recommendations based on user preferences
-   Browse movie genres

### 3. User Features

-   Save favorite movies
-   Create custom watchlists (create, view, update, delete)
-   Rate and review movies
-   User profile management
-   Personalized movie preferences

## API Endpoints

### Authentication Endpoints
-   `POST /api/v1/auth/register` - Register a new user
-   `POST /api/v1/auth/login` - Authenticate user and get tokens
-   `POST /api/v1/auth/refresh` - Refresh access token using a refresh token
-   `POST /api/v1/auth/logout` - Invalidate refresh token and log out user
-   `POST /api/v1/auth/forgot-password` - Request password reset
-   `POST /api/v1/auth/reset-password` - Reset password with token
-   `POST /api/v1/auth/verify-email` - Verify email address

### Movie Discovery Endpoints
-   `GET /api/v1/movies/search` - Search movies by query
    -   Query params: `query` (required), `page` (optional)
-   `GET /api/v1/movies/filter` - Filter movies by criteria
    -   Query params: `genre`, `minRating`, `maxRating`, `releaseDateGte`, `releaseDateLte`, `sortBy`, `page`
-   `GET /api/v1/movies/:id` - Get detailed movie information
    -   Path params: `id` (TMDB movie ID)
-   `GET /api/v1/movies/recommendations` - Get personalized recommendations
    -   Query params: `genreIds`, `minRating`, `page`
    -   Authentication: Optional (uses user preferences if authenticated)

### Rating and Review Endpoints
-   `POST /api/v1/movies/:movieId/rate-review` - Submit a rating and review for a movie
    -   Path params: `movieId` (TMDB movie ID)
    -   Body: `{ rating: number (1-5), review: string (optional) }`
    -   Authentication: Required
-   `GET /api/v1/movies/:movieId/ratings-reviews` - Get all ratings and reviews for a specific movie
    -   Path params: `movieId` (TMDB movie ID)
    -   Authentication: Optional
-   `PATCH /api/v1/movies/:movieId/rate-review` - Update an existing rating or review for a movie
    -   Path params: `movieId` (TMDB movie ID)
    -   Body: `{ rating: number (1-5, optional), review: string (optional) }`
    -   Authentication: Required

### Genre Endpoints
-   `GET /api/v1/genres` - Get all available movie genres

### User Profile and Favorites Endpoints
-   `GET /api/v1/users/profile` - Get user profile
    -   Authentication: Required
-   `PATCH /api/v1/users/profile` - Update user profile
    -   Authentication: Required
-   `PATCH /api/v1/users/password` - Change user's password
    -   Authentication: Required
-   `GET /api/v1/users/favorites` - Get a user's favorite movies
    -   Authentication: Required
-   `POST /api/v1/users/favorites/:movieId` - Add a movie to a user's favorites
    -   Path params: `movieId` (TMDB Movie ID)
    -   Authentication: Required
-   `DELETE /api/v1/users/favorites/:movieId` - Remove a movie from a user's favorites
    -   Path params: `movieId` (TMDB Movie ID)
    -   Authentication: Required

### Watchlist Endpoints
-   `POST /api/v1/users/watchlists` - Create a new watchlist for a user
    -   Body: `{ name: string, description: string (optional) }`
    -   Authentication: Required
-   `GET /api/v1/users/watchlists` - Get all watchlists for a user
    -   Authentication: Required
-   `GET /api/v1/users/watchlists/:watchlistId` - Get a specific watchlist by ID
    -   Path params: `watchlistId`
    -   Authentication: Required
-   `PUT /api/v1/users/watchlists/:watchlistId` - Update a specific watchlist
    -   Path params: `watchlistId`
    -   Body: `{ name: string (optional), description: string (optional) }`
    -   Authentication: Required
-   `DELETE /api/v1/users/watchlists/:watchlistId` - Delete a specific watchlist
    -   Path params: `watchlistId`
    -   Authentication: Required
-   `POST /api/v1/users/watchlists/:watchlistId/movies/:movieId` - Add a movie to a specific watchlist
    -   Path params: `watchlistId`, `movieId` (Watchlist ID, TMDB Movie ID)
    -   Authentication: Required
-   `DELETE /api/v1/users/watchlists/:watchlistId/movies/:movieId` - Remove a movie from a specific watchlist
    -   Path params: `watchlistId`, `movieId` (Watchlist ID, TMDB Movie ID)
    -   Authentication: Required

## API Documentation
The API is documented using Swagger/OpenAPI. You can access the API documentation at:

```http://localhost:5000/api/v1/docs
``` (when running locally)

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

For errors:

```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Validation failed: email is required"
}
```

## Hosted URLs

- **Frontend**: [https://your-frontend-url.com](https://your-frontend-url.com) (Replace with your actual frontend URL)
- **Backend**: [https://your-backend-url.com/api/v1](https://your-backend-url.com/api/v1) (Replace with your actual backend URL)

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.