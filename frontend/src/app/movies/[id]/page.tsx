"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { movieApi } from "@/lib/api/movies";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/store/authStore";
import { Movie, RatingReview } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, ArrowLeft, Heart, HeartOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

type RatingReviewRequest = {
  rating: number;
  review?: string;
};

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Movie data state
  const [movie, setMovie] = useState<Movie | null>(null);
  const [ratingsReviews, setRatingsReviews] = useState<RatingReview[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<number[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  // Form state
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");

  const movieId = parseInt(id as string, 10);

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!movieId || isNaN(movieId)) {
        toast.error("Invalid movie ID");
        router.push("/");
        return;
      }

      try {
        setIsLoading(true);

        // Load movie details (always available)
        const movieDetails = await movieApi.getMovieDetails(movieId);
        setMovie(movieDetails);

        // Load ratings and reviews if authenticated
        if (isAuthenticated) {
          try {
            const movieRatingsReviews =
              await movieApi.getMovieRatingsReviews(movieId);
            setRatingsReviews(movieRatingsReviews);
          } catch (error) {
            console.warn("Could not load ratings and reviews:", error);
            // Don't show error to user as this might be expected for some movies
          }

          // Load user's favorite movies
          try {
            const favorites = await userApi.getFavoriteMovies();
            setFavoriteMovies(favorites);
          } catch (error) {
            console.warn("Could not load favorite movies:", error);
          }
        }
      } catch (error) {
        console.error("Failed to load movie details:", error);
        toast.error("Failed to load movie details");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadMovieDetails();
  }, [id, movieId, isAuthenticated, router]);

  const handleSubmitRating = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to rate movies");
      router.push("/auth/login");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please provide a rating between 1 and 5");
      return;
    }

    try {
      setIsSubmittingRating(true);

      const ratingData: RatingReviewRequest = {
        rating,
        ...(review.trim() && { review: review.trim() }),
      };

      await movieApi.rateMovie(movieId, ratingData);

      toast.success("Rating submitted successfully!");

      // Reset form
      setRating(null);
      setReview("");

      // Refresh ratings and reviews
      try {
        const updatedRatingsReviews =
          await movieApi.getMovieRatingsReviews(movieId);
        setRatingsReviews(updatedRatingsReviews);
      } catch (error) {
        console.warn("Could not refresh ratings and reviews:", error);
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage favorites");
      router.push("/auth/login");
      return;
    }

    try {
      setIsLoadingFavorites(true);

      const isFavorite = favoriteMovies.includes(movieId);

      if (isFavorite) {
        await userApi.removeFavoriteMovie(movieId);
        setFavoriteMovies((prev) => prev.filter((id) => id !== movieId));
        toast.success("Removed from favorites");
      } else {
        await userApi.addFavoriteMovie(movieId);
        setFavoriteMovies((prev) => [...prev, movieId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites. Please try again.");
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading movie details...</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <Button onClick={() => router.push("/")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go back home
        </Button>
      </div>
    );
  }

  const isFavorite = favoriteMovies.includes(movieId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {isAuthenticated && (
              <Button
                variant={isFavorite ? "default" : "outline"}
                onClick={handleToggleFavorite}
                disabled={isLoadingFavorites}
                className="flex items-center gap-2"
              >
                {isLoadingFavorites ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isFavorite ? (
                  <Heart className="h-4 w-4 fill-current" />
                ) : (
                  <HeartOff className="h-4 w-4" />
                )}
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full rounded-lg shadow-lg"
                priority
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No poster available</span>
              </div>
            )}
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  {movie.title}
                </CardTitle>
                <CardDescription className="text-lg">
                  {movie.overview}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Movie Info */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>

                  {movie.release_date && (
                    <Badge variant="outline">
                      {new Date(movie.release_date).getFullYear()}
                    </Badge>
                  )}
                </div>

                {/* Genres */}
                {movie.genre_ids && movie.genre_ids.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genre_ids.map((genreId) => (
                      <Badge key={genreId} variant="secondary">
                        Genre {genreId}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rating and Review Form */}
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Rate and Review</CardTitle>
                  <CardDescription>
                    Share your thoughts about this movie
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="rating" className="font-medium">
                      Rating (1-5):
                    </Label>
                    <Input
                      type="number"
                      id="rating"
                      min="1"
                      max="5"
                      step="0.1"
                      value={rating ?? ""}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-24"
                      placeholder="4.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review" className="font-medium">
                      Review (optional):
                    </Label>
                    <Textarea
                      id="review"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="h-24 resize-none"
                      placeholder="Share your thoughts about this movie..."
                      maxLength={1000}
                    />
                    <p className="text-sm text-gray-500">
                      {review.length}/1000 characters
                    </p>
                  </div>

                  <Button
                    onClick={handleSubmitRating}
                    disabled={isSubmittingRating || !rating}
                    className="w-full sm:w-auto"
                  >
                    {isSubmittingRating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Rating"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Login prompt for unauthenticated users */}
            {!isAuthenticated && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Log in to rate this movie and add it to your favorites
                    </p>
                    <Button onClick={() => router.push("/auth/login")}>
                      Log In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ratings and Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Ratings and Reviews</CardTitle>
                <CardDescription>
                  What others think about this movie
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ratingsReviews.length > 0 ? (
                  <div className="space-y-4">
                    {ratingsReviews.map((rr) => (
                      <div
                        key={rr._id}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="font-semibold">
                            {rr.rating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(rr.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {rr.review && (
                          <p className="text-gray-700">{rr.review}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {isAuthenticated
                      ? "No ratings and reviews yet. Be the first to rate this movie!"
                      : "Log in to view ratings and reviews"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
