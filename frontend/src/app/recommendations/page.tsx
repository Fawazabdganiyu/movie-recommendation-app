"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { movieApi } from "@/lib/api/movies";
import { userApi } from "@/lib/api/user";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  Loader2,
  Sparkles,
  RefreshCw,
  Eye,
  Filter,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import AddToWatchlistButton from "@/components/AddToWatchlistButton";

interface RecommendationMeta {
  userId?: string;
  basedOnPreferences: boolean;
  genreIds?: number[];
  minRating?: number;
  languages?: string[];
  favoriteActors?: number[];
  favoriteDirectors?: number[];
  enhancedRecommendations: boolean;
}

interface RecommendationsResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
  recommendationMeta?: RecommendationMeta;
}

export default function RecommendationsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recommendationMeta, setRecommendationMeta] =
    useState<RecommendationMeta | null>(null);
  const [minRating, setMinRating] = useState("");

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to get personalized recommendations");
      router.push("/auth/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Load recommendations
  const loadRecommendations = async (page = 1, rating?: number) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(page === 1);
      if (page > 1) setIsRefreshing(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: any = { page };
      if (rating) options.minRating = rating;

      const response: RecommendationsResponse =
        await movieApi.getRecommendations(options);

      if (page === 1) {
        setMovies(response.results);
      } else {
        setMovies((prev) => [...prev, ...response.results]);
      }

      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
      setRecommendationMeta(response.recommendationMeta || null);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
      toast.error("Failed to load recommendations");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadRecommendations();
  }, [isAuthenticated]);

  // Handle rating filter
  const handleRatingFilter = () => {
    const rating = parseFloat(minRating);
    if (rating >= 0 && rating <= 10) {
      loadRecommendations(1, rating);
    } else {
      toast.error("Please enter a rating between 0 and 10");
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setMinRating("");
    loadRecommendations(1);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      const rating = parseFloat(minRating) || undefined;
      loadRecommendations(currentPage + 1, rating);
    }
  };

  // Handle movie navigation
  const handleMovieClick = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-gray-50 border-gray-300 text-gray-700 font-medium"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Personalized Recommendations
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/preferences")}
                className="flex items-center gap-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                <Settings className="h-5 w-5 text-gray-600" />
                Preferences
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Welcome, {user?.firstName || "Movie Lover"}!
              </CardTitle>
              <CardDescription>
                Here are personalized movie recommendations based on your
                preferences and viewing history.
              </CardDescription>
            </CardHeader>
            {recommendationMeta && (
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Recommendation Details
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>
                      • Based on your saved preferences:{" "}
                      {recommendationMeta.basedOnPreferences ? "Yes" : "No"}
                    </p>
                    {recommendationMeta.genreIds &&
                      recommendationMeta.genreIds.length > 0 && (
                        <p>
                          • Favorite genres:{" "}
                          {recommendationMeta.genreIds.length} selected
                        </p>
                      )}
                    {recommendationMeta.favoriteActors &&
                      recommendationMeta.favoriteActors.length > 0 && (
                        <p>
                          • Favorite actors:{" "}
                          {recommendationMeta.favoriteActors.length} selected
                        </p>
                      )}
                    {recommendationMeta.favoriteDirectors &&
                      recommendationMeta.favoriteDirectors.length > 0 && (
                        <p>
                          • Favorite directors:{" "}
                          {recommendationMeta.favoriteDirectors.length} selected
                        </p>
                      )}
                    {recommendationMeta.minRating && (
                      <p>
                        • Minimum rating filter: {recommendationMeta.minRating}
                      </p>
                    )}
                    <p>
                      • Enhanced recommendations:{" "}
                      {recommendationMeta.enhancedRecommendations
                        ? "Enabled"
                        : "Basic"}
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1 max-w-xs">
                  <label
                    htmlFor="minRating"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Minimum Rating
                  </label>
                  <Input
                    id="minRating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    placeholder="e.g., 7.5"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  onClick={handleRatingFilter}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply Filter
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Movies Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">
                Loading personalized recommendations...
              </span>
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => handleMovieClick(movie.id)}
                  />
                ))}
              </div>

              {/* Load More */}
              {currentPage < totalPages && (
                <div className="flex justify-center pt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isRefreshing}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isRefreshing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4" />
                        Load More Recommendations
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No recommendations found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any movies matching your current
                  preferences. Try adjusting your filters or updating your
                  preferences.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/preferences")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Update Preferences
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

// Movie Card Component
interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-[2/3] relative bg-gray-200">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100 font-medium"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "Unknown"}
          </p>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-xs font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Add to Watchlist Button */}
        <AddToWatchlistButton
          movieId={movie.id}
          movieTitle={movie.title}
          size="sm"
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
        />
      </CardContent>
    </Card>
  );
}
