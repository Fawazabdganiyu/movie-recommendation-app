/**
 * Movie Types for TMDB Integration
 */
/**
 * Genre Definition
 */
export interface Genre {
    id: number;
    name: string;
}
/**
 * Core Movie Data from TMDB
 */
export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    genres?: Genre[];
    adult: boolean;
    original_language: string;
    original_title: string;
    popularity: number;
    video: boolean;
}
/**
 * Movie List Response from TMDB
 */
export interface MovieListResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}
/**
 * Recommendation Request/Response
 */
export interface RecommendationRequest {
    userId?: string;
    genreIds?: number[];
    minRating?: number;
    page?: number;
}
export interface RecommendationResponse {
    recommendations: Movie[];
    reason: string;
    confidence: number;
}
/**
 * User Rating for a Movie
 */
export interface UserRatingReview {
    _id?: string;
    movieId: number;
    rating?: number;
    review?: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}
//# sourceMappingURL=movie.d.ts.map