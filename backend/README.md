# Movie Recommendation App - Backend

This is the backend component of the Movie Recommendation App, built with Express.js and MongoDB.

## Tech Stack

- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool
- **TypeScript**: Language for application-scale JavaScript
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: For password hashing
- **CORS**: Cross-Origin Resource Sharing middleware

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files (database, environment variables)
│   ├── container/    # Dependency injection setup
│   ├── controllers/  # Route handlers and business logic orchestration
│   ├── docs/         # API documentation files (OpenAPI/Swagger)
│   ├── errors/       # Custom error classes
│   ├── middleware/   # Express middleware (authentication, validation)
│   ├── models/       # Mongoose models (schemas)
│   ├── repositories/ # Data access layer (database interactions)
│   ├── routes/       # API route definitions
│   ├── services/     # Business logic and external API integrations
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   └── validation/   # Request body validation schemas (Zod)
├── tests/          # Unit and integration tests
├── package.json    # Project dependencies and scripts
└── tsconfig.json   # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud instance)
- TMDB API Key (for accessing movie data)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd movie-recommendation-app/backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure environment variables:

    - Create a `.env` file in the `backend/` directory.
    - Add the following environment variables, replacing the placeholders with your actual values:

    ```
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/movie-recommendation-app
    JWT_SECRET=your-secret-key
    JWT_REFRESH_SECRET=your-refresh-secret-key
    TMDB_API_KEY=your-tmdb-api-key
    ```

### Running the application

```bash
npm run dev
```

This will start the backend server in development mode with hot reloading. The API will be available at `http://localhost:5000/api/v1`.

## API Documentation

The API documentation is generated using Swagger/OpenAPI. You can access it by navigating to `http://localhost:5000/api/v1/docs` in your browser when the server is running.

## Key Features

- **User Authentication**: Secure user registration, login, and authentication using JWTs.
- **Movie Data**: Integration with the TMDB API to fetch movie details, search for movies, and retrieve recommendations.
- **User Profile Management**: Allows users to manage their profile information and preferences.
- **Watchlist Management**: Enables users to create and manage custom movie watchlists.
- **Rating and Reviews**: Users can rate and review movies.
- **Robust Error Handling**: Comprehensive error handling and validation using Zod.

## Deployment

The backend can be deployed to various platforms, such as Render, Heroku, or AWS. Ensure that you configure the necessary environment variables in your deployment environment.

## Contributing

Contributions are welcome! Please refer to the project's main `CONTRIBUTING.md` for guidelines.

## License

This project is licensed under the MIT License.