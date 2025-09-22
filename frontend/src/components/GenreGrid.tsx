'use client';

import React, { useState, useEffect } from 'react';
import { genresApi } from '@/lib/api/genres';
import { Genre } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface GenreGridProps {
  selectedGenres?: number[];
  onGenreSelect?: (genreId: number) => void;
  onGenreDeselect?: (genreId: number) => void;
  multiSelect?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export const GenreGrid: React.FC<GenreGridProps> = ({
  selectedGenres = [],
  onGenreSelect,
  onGenreDeselect,
  multiSelect = true,
  className = '',
  title = 'Movie Genres',
  description = 'Select genres to filter movies or set preferences',
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
        setGenres(genreList);
      } catch (err) {
        console.error('Failed to load genres:', err);
        setError('Failed to load genres');
      } finally {
        setIsLoading(false);
      }
    };

    loadGenres();
  }, []);

  const handleGenreClick = (genreId: number) => {
    const isSelected = selectedGenres.includes(genreId);

    if (isSelected) {
      onGenreDeselect?.(genreId);
    } else {
      if (!multiSelect) {
        // For single select, deselect all others first
        selectedGenres.forEach(id => {
          if (id !== genreId) {
            onGenreDeselect?.(id);
          }
        });
      }
      onGenreSelect?.(genreId);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Loading genres...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            return (
              <Button
                key={genre.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleGenreClick(genre.id)}
                className={`
                  h-auto py-3 px-4 text-xs font-medium transition-colors
                  ${isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {genre.name}
              </Button>
            );
          })}
        </div>

        {selectedGenres.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              Selected genres ({selectedGenres.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genreId) => {
                const genre = genres.find(g => g.id === genreId);
                return (
                  <span
                    key={genreId}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {genre?.name || `Unknown (${genreId})`}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GenreGrid;
