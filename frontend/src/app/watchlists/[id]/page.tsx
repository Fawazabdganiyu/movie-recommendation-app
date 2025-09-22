"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { watchlistApi, Watchlist } from "@/lib/api/watchlist";
import { movieApi } from "@/lib/api/movies";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Star,
  Loader2,
  Search,
  Plus,
  X,
  Calendar,
  Clock,
  Film,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface WatchlistWithMovies extends Watchlist {
  movieDetails: Movie[];
}

export default function WatchlistDetailPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const watchlistId = params.id as string;

  // State
  const [watchlist, setWatchlist] = useState<WatchlistWithMovies | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddMovieDialog, setShowAddMovieDialog] = useState(false);
  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingMovieId, setAddingMovieId] = useState<number | null>(null);
  const [removingMovieId, setRemovingMovieId] = useState<number | null>(null);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your watchlist");
      router.push("/auth/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Load watchlist details
  const loadWatchlistDetails = async () => {
    if (!isAuthenticated || !watchlistId) return;

    try {
      setIsLoading(true);
      const watchlistData = await watchlistApi.getWatchlistById(watchlistId);

      // Load movie details
      let movieDetails: Movie[] = [];
      if (watchlistData.movies.length > 0) {
        const moviePromises = watchlistData.movies.map((movieId) =>
          movieApi.getMovieDetails(movieId),
        );
        movieDetails = await Promise.all(moviePromises);
      }

      setWatchlist({ ...watchlistData, movieDetails });
      setNewName(watchlistData.name);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
      toast.error("Failed to load watchlist");
      router.push("/watchlists");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadWatchlistDetails();
  }, [isAuthenticated, watchlistId]);

  // Update watchlist name
  const handleUpdateName = async () => {
    if (!watchlist || !newName.trim()) {
      toast.error("Please enter a valid name");
      return;
    }

    try {
      setIsUpdating(true);
      await watchlistApi.updateWatchlist(watchlist._id, {
        name: newName.trim(),
      });
      setWatchlist((prev) => (prev ? { ...prev, name: newName.trim() } : null));
      setEditingName(false);
      toast.success("Watchlist name updated successfully");
    } catch (error) {
      console.error("Failed to update watchlist:", error);
      toast.error("Failed to update watchlist name");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete watchlist
  const handleDeleteWatchlist = async () => {
    if (!watchlist) return;

    try {
      setIsDeleting(true);
      await watchlistApi.deleteWatchlist(watchlist._id);
      toast.success("Watchlist deleted successfully");
      router.push("/watchlists");
    } catch (error) {
      console.error("Failed to delete watchlist:", error);
      toast.error("Failed to delete watchlist");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Search movies
  const handleSearchMovies = async () => {
    if (!movieSearchQuery.trim()) return;

    try {
      setIsSearching(true);
      const response = await movieApi.searchMovies(movieSearchQuery);
      setSearchResults(response.results);
    } catch (error) {
      console.error("Failed to search movies:", error);
      toast.error("Failed to search movies");
    } finally {
      setIsSearching(false);
    }
  };

  // Add movie to watchlist
  const handleAddMovie = async (movie: Movie) => {
    if (!watchlist) return;

    // Check if movie is already in watchlist
    if (watchlist.movies.includes(movie.id)) {
      toast.error("Movie is already in this watchlist");
      return;
    }

    try {
      setAddingMovieId(movie.id);
      await watchlistApi.addMovieToWatchlist(watchlist._id, movie.id);

      // Update local state
      setWatchlist((prev) =>
        prev
          ? {
              ...prev,
              movies: [...prev.movies, movie.id],
              movieDetails: [...prev.movieDetails, movie],
            }
          : null,
      );

      toast.success(`"${movie.title}" added to watchlist`);
      setShowAddMovieDialog(false);
      setMovieSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to add movie:", error);
      toast.error("Failed to add movie to watchlist");
    } finally {
      setAddingMovieId(null);
    }
  };

  // Remove movie from watchlist
  const handleRemoveMovie = async (movieId: number) => {
    if (!watchlist) return;

    try {
      setRemovingMovieId(movieId);
      await watchlistApi.removeMovieFromWatchlist(watchlist._id, movieId);

      // Update local state
      setWatchlist((prev) =>
        prev
          ? {
              ...prev,
              movies: prev.movies.filter((id) => id !== movieId),
              movieDetails: prev.movieDetails.filter(
                (movie) => movie.id !== movieId,
              ),
            }
          : null,
      );

      toast.success("Movie removed from watchlist");
    } catch (error) {
      console.error("Failed to remove movie:", error);
      toast.error("Failed to remove movie from watchlist");
    } finally {
      setRemovingMovieId(null);
    }
  };

  // Navigate to movie details
  const handleViewMovie = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading watchlist...</p>
        </div>
      </div>
    );
  }

  if (!watchlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Watchlist not found
          </h3>
          <p className="text-gray-600 mb-4">
            The watchlist you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Button onClick={() => router.push("/watchlists")}>
            Back to Watchlists
          </Button>
        </div>
      </div>
    );
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
                onClick={() => router.push("/watchlists")}
                className="flex items-center gap-2 hover:bg-gray-50 border-gray-300 text-gray-700 font-medium"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                Back to Watchlists
              </Button>

              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
                    className="w-64 text-gray-600"
                  />
                  <Button
                    size="sm"
                    onClick={handleUpdateName}
                    disabled={isUpdating || !newName.trim()}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingName(false);
                      setNewName(watchlist.name);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {watchlist.name}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingName(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Dialog
                open={showAddMovieDialog}
                onOpenChange={setShowAddMovieDialog}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-5 w-5" />
                    Add Movies
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Movies to Watchlist</DialogTitle>
                    <DialogDescription>
                      Search for movies to add to &quot;{watchlist.name}&quot;.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search for movies..."
                        value={movieSearchQuery}
                        onChange={(e) => setMovieSearchQuery(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSearchMovies()
                        }
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSearchMovies}
                        disabled={isSearching || !movieSearchQuery.trim()}
                      >
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {searchResults.length > 0 && (
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {searchResults.map((movie) => (
                          <div
                            key={movie.id}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                              {movie.poster_path ? (
                                <Image
                                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                  alt={movie.title}
                                  width={48}
                                  height={64}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium line-clamp-1">
                                {movie.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {movie.release_date
                                  ? new Date(movie.release_date).getFullYear()
                                  : "Unknown"}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm">
                                  {movie.vote_average.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleAddMovie(movie)}
                              disabled={
                                addingMovieId === movie.id ||
                                watchlist.movies.includes(movie.id)
                              }
                              size="sm"
                            >
                              {addingMovieId === movie.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : watchlist.movies.includes(movie.id) ? (
                                "Added"
                              ) : (
                                "Add"
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Watchlist Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5 text-blue-500" />
              Watchlist Details
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1">
                  <Film className="h-4 w-4" />
                  {watchlist.movies.length} movies
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {new Date(watchlist.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Updated {new Date(watchlist.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Movies Grid */}
        {watchlist.movieDetails.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlist.movieDetails.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onView={() => handleViewMovie(movie.id)}
                onRemove={() => handleRemoveMovie(movie.id)}
                isRemoving={removingMovieId === movie.id}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No movies in this watchlist
              </h3>
              <p className="text-gray-600 mb-6">
                Start building your collection by adding some movies.
              </p>
              <Button
                onClick={() => setShowAddMovieDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Movie
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Delete Watchlist Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Watchlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{watchlist.name}&quot;? This
              action cannot be undone and will remove all{" "}
              {watchlist.movies.length} movies from this list.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWatchlist}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Watchlist"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Movie Card Component
interface MovieCardProps {
  movie: Movie;
  onView: () => void;
  onRemove: () => void;
  isRemoving: boolean;
}

function MovieCard({ movie, onView, onRemove, isRemoving }: MovieCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
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

        {/* Remove button */}
        <Button
          onClick={onRemove}
          disabled={isRemoving}
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-600 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>

        {/* View button overlay */}
        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              onClick={onView}
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
          className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
          onClick={onView}
        >
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
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
      </CardContent>
    </Card>
  );
}
