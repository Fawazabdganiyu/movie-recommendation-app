'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { movieApi } from '@/lib/api/movies';
import { userApi } from '@/lib/api/user';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Star, Search, Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadPopularMovies = async () => {
      try {
        setIsLoading(true);
        const response = await movieApi.getPopularMovies();
        setMovies(response.results);
      } catch (error) {
        console.error('Failed to load movies:', error);
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
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRateMovie = async (movieId: number, rating: number) => {
    try {
      await userApi.rateMovie({ movieId, rating });
      // You could add a toast notification here
      console.log('Movie rated successfully');
    } catch (error) {
      console.error('Failed to rate movie:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
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
                  Welcome back, {user.fullName}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <Card>
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Movies Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : 'Popular Movies'}
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
                  ? 'No movies found. Try a different search term.'
                  : 'No movies available.'}
              </p>
            </div>
          )}
        </div>
      </main>
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

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
    onRate(movie.id, rating);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[2/3] relative bg-gray-200">
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
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : 'Unknown'}
        </p>

        {/* Rating Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
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
                  className={`h-4 w-4 transition-colors ${
                    rating <= (hoveredRating || userRating)
                      ? 'text-blue-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
