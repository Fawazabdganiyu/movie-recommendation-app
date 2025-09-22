"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { watchlistApi, Watchlist } from "@/lib/api/watchlist";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bookmark, Plus, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface AddToWatchlistButtonProps {
  movieId: number;
  movieTitle: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  children?: React.ReactNode;
}

export default function AddToWatchlistButton({
  movieId,
  movieTitle,
  size = "sm",
  variant = "outline",
  className = "",
  children,
}: AddToWatchlistButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState<string | null>(
    null,
  );

  // Load user's watchlists when dialog opens
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

  // Load watchlists when dialog opens
  useEffect(() => {
    if (showDialog && isAuthenticated) {
      loadWatchlists();
    }
  }, [showDialog, isAuthenticated]);

  // Add movie to watchlist
  const handleAddToWatchlist = async (
    watchlistId: string,
    watchlistName: string,
  ) => {
    try {
      setAddingToWatchlist(watchlistId);
      await watchlistApi.addMovieToWatchlist(watchlistId, movieId);
      toast.success(`"${movieTitle}" added to "${watchlistName}"`);
      setShowDialog(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to add movie to watchlist:", error);
      if (error.response?.data?.message?.includes("already")) {
        toast.error("Movie is already in this watchlist");
      } else {
        toast.error("Failed to add movie to watchlist");
      }
    } finally {
      setAddingToWatchlist(null);
    }
  };

  // Check if movie is in watchlist
  const isMovieInWatchlist = (watchlist: Watchlist) => {
    return watchlist.movies.includes(movieId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger>
        <Button size={size} variant={variant} className={className}>
          {children || (
            <>
              <Bookmark className="h-4 w-4 mr-2" />
              Add to Watchlist
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Watchlist</DialogTitle>
          <DialogDescription className="text-gray-500">
            Choose which watchlist to add `&quot{movieTitle}`&quot to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading watchlists...</span>
            </div>
          ) : watchlists.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {watchlists.map((watchlist) => {
                const isInWatchlist = isMovieInWatchlist(watchlist);
                const isAdding = addingToWatchlist === watchlist._id;

                return (
                  <div
                    key={watchlist._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {watchlist.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {watchlist.movies.length} movies
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        handleAddToWatchlist(watchlist._id, watchlist.name)
                      }
                      disabled={isInWatchlist || isAdding}
                      size="sm"
                      variant={isInWatchlist ? "secondary" : "default"}
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : isInWatchlist ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">
                No watchlists yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first watchlist to start organizing your movies.
              </p>
              <Button
                onClick={() => {
                  setShowDialog(false);
                  // Navigate to watchlists page to create one
                  window.location.href = "/watchlists";
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Watchlist
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
