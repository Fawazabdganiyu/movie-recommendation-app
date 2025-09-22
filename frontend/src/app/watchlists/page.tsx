"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  BookmarkPlus,
  Film,
  Calendar,
  MoreVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface WatchlistWithMovies extends Watchlist {
  movieDetails?: Movie[];
}

export default function WatchlistsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // State
  const [watchlists, setWatchlists] = useState<WatchlistWithMovies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingWatchlist, setEditingWatchlist] = useState<Watchlist | null>(
    null,
  );
  const [deletingWatchlist, setDeletingWatchlist] = useState<Watchlist | null>(
    null,
  );
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [editWatchlistName, setEditWatchlistName] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loadingMovieDetails, setLoadingMovieDetails] = useState<string[]>([]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your watchlists");
      router.push("/auth/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Load watchlists
  const loadWatchlists = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const data = await watchlistApi.getUserWatchlists();
      setWatchlists(data);
    } catch (error) {
      console.error("Failed to load watchlists:", error);
      toast.error("Failed to load watchlists");
    } finally {
      setIsLoading(false);
    }
  };

  // Load movie details for a watchlist
  const loadMovieDetails = async (watchlist: WatchlistWithMovies) => {
    if (watchlist.movies.length === 0 || watchlist.movieDetails) return;

    setLoadingMovieDetails((prev) => [...prev, watchlist._id]);

    try {
      const moviePromises = watchlist.movies.map((movieId) =>
        movieApi.getMovieDetails(movieId),
      );
      const movieDetails = await Promise.all(moviePromises);

      setWatchlists((prev) =>
        prev.map((w) => (w._id === watchlist._id ? { ...w, movieDetails } : w)),
      );
    } catch (error) {
      console.error("Failed to load movie details:", error);
      toast.error("Failed to load movie details");
    } finally {
      setLoadingMovieDetails((prev) =>
        prev.filter((id) => id !== watchlist._id),
      );
    }
  };

  // Initial load
  useEffect(() => {
    loadWatchlists();
  }, [isAuthenticated]);

  // Create watchlist
  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      toast.error("Please enter a watchlist name");
      return;
    }

    try {
      setIsCreating(true);
      await watchlistApi.createWatchlist({ name: newWatchlistName.trim() });
      toast.success("Watchlist created successfully");
      setNewWatchlistName("");
      setShowCreateDialog(false);
      loadWatchlists();
    } catch (error) {
      console.error("Failed to create watchlist:", error);
      toast.error("Failed to create watchlist");
    } finally {
      setIsCreating(false);
    }
  };

  // Update watchlist
  const handleUpdateWatchlist = async () => {
    if (!editingWatchlist || !editWatchlistName.trim()) {
      toast.error("Please enter a watchlist name");
      return;
    }

    try {
      await watchlistApi.updateWatchlist(editingWatchlist._id, {
        name: editWatchlistName.trim(),
      });
      toast.success("Watchlist updated successfully");
      setEditingWatchlist(null);
      setEditWatchlistName("");
      setShowEditDialog(false);
      loadWatchlists();
    } catch (error) {
      console.error("Failed to update watchlist:", error);
      toast.error("Failed to update watchlist");
    }
  };

  // Delete watchlist
  const handleDeleteWatchlist = async () => {
    if (!deletingWatchlist) return;

    try {
      await watchlistApi.deleteWatchlist(deletingWatchlist._id);
      toast.success("Watchlist deleted successfully");
      setDeletingWatchlist(null);
      setShowDeleteDialog(false);
      loadWatchlists();
    } catch (error) {
      console.error("Failed to delete watchlist:", error);
      toast.error("Failed to delete watchlist");
    }
  };

  // Open edit dialog
  const openEditDialog = (watchlist: Watchlist) => {
    setEditingWatchlist(watchlist);
    setEditWatchlistName(watchlist.name);
    setShowEditDialog(true);
  };

  // Open delete dialog
  const openDeleteDialog = (watchlist: Watchlist) => {
    setDeletingWatchlist(watchlist);
    setShowDeleteDialog(true);
  };

  // Navigate to watchlist details
  const handleViewWatchlist = (watchlistId: string) => {
    router.push(`/watchlists/${watchlistId}`);
  };

  // Navigate to movie details
  const handleViewMovie = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  if (!isAuthenticated) {
    return null;
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
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 hover:bg-gray-50 border-gray-300 text-gray-700 font-medium"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                My Watchlists
              </h1>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger>
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-5 w-5" />
                  Create Watchlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-gray-400">
                    Create New Watchlist
                  </DialogTitle>
                  <DialogDescription>
                    Give your watchlist a name to organize your favorite movies.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-gray-500">
                  <Input
                    placeholder="Enter watchlist name..."
                    value={newWatchlistName}
                    onChange={(e) => setNewWatchlistName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCreateWatchlist()
                    }
                  />
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateDialog(false);
                        setNewWatchlistName("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateWatchlist}
                      disabled={isCreating || !newWatchlistName.trim()}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Watchlist"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookmarkPlus className="h-5 w-5 text-blue-500" />
              Welcome to Your Watchlists, {user?.firstName || "Movie Lover"}!
            </CardTitle>
            <CardDescription>
              Organize your must-watch movies into custom lists. Create
              different lists for different moods, genres, or occasions.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Watchlists Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your watchlists...</span>
          </div>
        ) : watchlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlists.map((watchlist) => (
              <WatchlistCard
                key={watchlist._id}
                watchlist={watchlist}
                onView={() => handleViewWatchlist(watchlist._id)}
                onEdit={() => openEditDialog(watchlist)}
                onDelete={() => openDeleteDialog(watchlist)}
                onLoadMovies={() => loadMovieDetails(watchlist)}
                onViewMovie={handleViewMovie}
                isLoadingMovies={loadingMovieDetails.includes(watchlist._id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No watchlists yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first watchlist to start organizing your movie
                collection.
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Watchlist
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Edit Watchlist Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Watchlist</DialogTitle>
            <DialogDescription>
              Update the name of your watchlist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter watchlist name..."
              value={editWatchlistName}
              onChange={(e) => setEditWatchlistName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUpdateWatchlist()}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingWatchlist(null);
                  setEditWatchlistName("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateWatchlist}
                disabled={!editWatchlistName.trim()}
              >
                Update Watchlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Watchlist Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Watchlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingWatchlist?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingWatchlist(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWatchlist}>
              Delete Watchlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Watchlist Card Component
interface WatchlistCardProps {
  watchlist: WatchlistWithMovies;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onLoadMovies: () => void;
  onViewMovie: (movieId: number) => void;
  isLoadingMovies: boolean;
}

function WatchlistCard({
  watchlist,
  onView,
  onEdit,
  onDelete,
  onLoadMovies,
  onViewMovie,
  isLoadingMovies,
}: WatchlistCardProps) {
  const [showMovies, setShowMovies] = useState(false);

  const handleToggleMovies = () => {
    if (!showMovies && !watchlist.movieDetails) {
      onLoadMovies();
    }
    setShowMovies(!showMovies);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {watchlist.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1">
                <Film className="h-4 w-4" />
                {watchlist.movies.length} movies
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(watchlist.updatedAt).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Movie Preview */}
        {watchlist.movies.length > 0 && (
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={handleToggleMovies}
              className="w-full justify-start p-0 h-auto text-sm text-gray-600 hover:text-gray-800"
            >
              {showMovies
                ? "Hide movies"
                : `Preview ${Math.min(3, watchlist.movies.length)} movies`}
              <MoreVertical className="h-4 w-4 ml-auto" />
            </Button>

            {showMovies && (
              <div className="mt-3">
                {isLoadingMovies ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2 text-sm">Loading movies...</span>
                  </div>
                ) : watchlist.movieDetails ? (
                  <div className="grid grid-cols-3 gap-2">
                    {watchlist.movieDetails.slice(0, 6).map((movie) => (
                      <div
                        key={movie.id}
                        className="cursor-pointer group"
                        onClick={() => onViewMovie(movie.id)}
                      >
                        <div className="aspect-[2/3] relative bg-gray-200 rounded overflow-hidden">
                          {movie.poster_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                              alt={movie.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <p className="text-xs mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {movie.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {watchlist.movieDetails &&
                  watchlist.movieDetails.length > 6 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      +{watchlist.movieDetails.length - 6} more movies
                    </p>
                  )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onView}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
