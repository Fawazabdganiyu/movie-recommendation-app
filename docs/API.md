# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Send password reset email
- `POST /auth/reset-password` - Reset password with token

### Movies

- `GET /movies` - Get popular movies with pagination
- `GET /movies/search` - Search movies
- `GET /movies/:id` - Get movie details
- `GET /movies/trending` - Get trending movies
- `GET /movies/genres` - Get movie genres

### Users

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `DELETE /users/account` - Delete user account
- `GET /users/preferences` - Get user preferences
- `PUT /users/preferences` - Update user preferences

### Watchlist

- `GET /watchlist` - Get user's watchlist
- `POST /watchlist` - Add movie to watchlist
- `DELETE /watchlist/:movieId` - Remove movie from watchlist

### Reviews

- `GET /reviews/movie/:movieId` - Get reviews for a movie
- `POST /reviews` - Create a review
- `PUT /reviews/:reviewId` - Update a review
- `DELETE /reviews/:reviewId` - Delete a review

### Recommendations

- `GET /recommendations` - Get personalized recommendations
- `GET /recommendations/similar/:movieId` - Get similar movies
- `GET /recommendations/trending` - Get trending recommendations

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information (development only)"
}
```

## Rate Limiting

- 100 requests per 15-minute window per IP address
- Authentication endpoints: 5 requests per 15-minute window per IP

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error
