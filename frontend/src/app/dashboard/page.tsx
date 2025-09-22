"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { movieApi } from "@/lib/api/movies";
import AddToWatchlistButton from "@/components/AddToWatchlistButton";

import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Star,
  Search,
  Loader2,
  LogOut,
  Filter,
  Tag,
  Eye,
  User,
  Sparkles,
  ArrowRight,
  Bookmark,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MovieFilter from "@/components/MovieFilter";
import Image from "next/image";

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const loadPopularMovies = async () => {
      try {
        setIsLoading(true);
        const response = await movieApi.getPopularMovies(1);
        setMovies(response.results);
      } catch (error) {
        console.error("Failed to load popular movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularMovies();
  }, [isAuthenticated, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const response = await movieApi.searchMovies(searchQuery);
      setMovies(response.results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRateMovie = async (movieId: number, rating: number) => {
    try {
      await movieApi.rateMovie(movieId, { rating });
    } catch (error) {
      console.error("Failed to rate movie:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const resetToPopularMovies = async () => {
    try {
      setIsLoading(true);
      const response = await movieApi.getPopularMovies(1);
      setMovies(response.results);
    } catch (error) {
      console.error("Failed to reset to popular movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Movie Recommendations
              </h1>
              {user && (
                <p className="text-sm text-gray-500">
                  Welcome back, {user.firstName}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/recommendations")}
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Sparkles className="h-5 w-5" />
                My Recommendations
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                <User className="h-5 w-5 text-gray-600" />
                Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/watchlists")}
                className="flex items-center gap-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                <Bookmark className="h-5 w-5 text-gray-600" />
                Watchlists
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/preferences")}
                className="flex items-center gap-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                <Tag className="h-5 w-5 text-gray-600" />
                Preferences
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/genres")}
                className="flex items-center gap-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                <Tag className="h-5 w-5 text-gray-600" />
                Genres
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          {/* Search Section */}
          <Card className="mb-4 md:mb-0 md:w-1/2">
            <CardHeader>
              <CardTitle>Search Movies</CardTitle>
              <CardDescription>
                Find movies to rate and get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search for movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={searchLoading}>
                  {searchLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  ) : (
                    <Search className="h-5 w-5 text-gray-500" />
                  )}
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Filter Button */}
          <Button onClick={toggleFilter} className="md:ml-4">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Recommendations CTA */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              Ready for Your Personal Picks?
            </CardTitle>
            <CardDescription className="text-blue-100">
              Based on your ratings and preferences, we&apos;ve curated a
              special list of movies just for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              onClick={() => router.push("/recommendations")}
              className="bg-white text-blue-600 font-bold hover:bg-gray-100"
            >
              View My Recommendations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Movies Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Popular Movies"}
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onRate={handleRateMovie}
                />
              ))}
            </div>
          )}

          {!isLoading && movies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery
                  ? "No movies found. Try a different search term."
                  : "No movies available."}
              </p>
            </div>
          )}
        </div>
      </main>
      {/* Movie Filter Modal (Conditionally Rendered) */}
      {/* Movie Filter Dialog */}
      {filterOpen && (
        <MovieFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onFilter={async (filters) => {
            // Apply filters and update the movie list
            console.log("Applying filters:", filters);
            try {
              setIsLoading(true);
              const filteredMovies = await movieApi.filterMovies(filters);
              setMovies(filteredMovies.results);
            } catch (error) {
              console.error("Failed to filter movies:", error);
            } finally {
              setIsLoading(false);
            }
          }}
          onReset={resetToPopularMovies}
        />
      )}
    </div>
  );
}

// Movie Card Component
interface MovieCardProps {
  movie: Movie;
  onRate: (movieId: number, rating: number) => void;
}

function MovieCard({ movie, onRate }: MovieCardProps) {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const router = useRouter();

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
    onRate(movie.id, rating);
  };

  const handleViewDetails = () => {
    router.push(`/movies/${movie.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className="aspect-[2/3] relative bg-gray-200 cursor-pointer"
        onClick={handleViewDetails}
      >
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
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
        <h3
          className="font-semibold text-sm mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
          onClick={handleViewDetails}
        >
          {movie.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "Unknown"}
        </p>

        {/* Rating Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          {/* User Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className="p-1"
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => handleRatingClick(rating)}
              >
                <Star
                  className={`h-5 w-5 transition-colors cursor-pointer ${
                    rating <= (hoveredRating || userRating)
                      ? "text-blue-500 fill-current"
                      : "text-gray-300 hover:text-gray-400"
                  }`}
                />
              </button>
            ))}
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
