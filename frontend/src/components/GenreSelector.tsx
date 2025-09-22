"use client";

import React, { useState, useEffect } from "react";
import { genresApi } from "@/lib/api/genres";
import { Genre } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

interface GenreSelectorProps {
  selectedGenres?: number[];
  onGenreChange: (genreIds: number[]) => void;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenres = [],
  onGenreChange,
  multiple = false,
  placeholder = "Select genre(s)",
  className = "",
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const genreList = await genresApi.getGenres();

        // Ensure we always have an array
        setGenres(Array.isArray(genreList) ? genreList : []);
      } catch (err) {
        console.error("Failed to load genres:", err);
        setError("Failed to load genres");
        setGenres([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    loadGenres();
  }, []);

  const handleGenreSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = parseInt(event.target.value, 10);

    if (!genreId) return;

    if (multiple) {
      if (selectedGenres.includes(genreId)) {
        // Remove genre if already selected
        onGenreChange(selectedGenres.filter((g) => g !== genreId));
      } else {
        // Add genre to selection
        onGenreChange([...selectedGenres, genreId]);
      }
      // Reset select value for multiple selection
      event.target.value = "";
    } else {
      // Single selection
      onGenreChange([genreId]);
    }
  };

  const removeGenre = (genreId: number) => {
    onGenreChange(selectedGenres.filter((g) => g !== genreId));
  };

  const clearAll = () => {
    onGenreChange([]);
  };

  const getGenreName = (genreId: number): string => {
    if (!Array.isArray(genres)) {
      return `Genre ${genreId}`;
    }
    const genre = genres.find((g) => g.id === genreId);
    return genre ? genre.name : `Unknown (${genreId})`;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-500">Loading genres...</span>
      </div>
    );
  }

  if (error) {
    return <div className={`text-sm text-red-500 ${className}`}>{error}</div>;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <select
        onChange={handleGenreSelect}
        value={multiple ? "" : selectedGenres[0] || ""}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {genres.map((genre) => (
          <option
            key={genre.id}
            value={genre.id}
            disabled={!multiple && selectedGenres.includes(genre.id)}
          >
            {genre.name}
          </option>
        ))}
      </select>

      {/* Display selected genres */}
      {selectedGenres.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genreId) => (
              <Badge
                key={genreId}
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>{getGenreName(genreId)}</span>
                <button
                  onClick={() => removeGenre(genreId)}
                  className="ml-1 hover:text-red-500"
                  aria-label={`Remove ${getGenreName(genreId)}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {multiple && selectedGenres.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default GenreSelector;
