import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GenreSelector } from "@/components/GenreSelector";

interface MovieFilterProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilter: (filters: any) => void;
  onReset?: () => void;
}

const MovieFilter: React.FC<MovieFilterProps> = ({
  open,
  onClose,
  onFilter,
  onReset,
}) => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [releaseDateGte, setReleaseDateGte] = useState("");
  const [releaseDateLte, setReleaseDateLte] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  const handleResetFilters = () => {
    setSelectedGenres([]);
    setMinRating("");
    setMaxRating("");
    setReleaseDateGte("");
    setReleaseDateLte("");
    setSortBy("popularity.desc");

    // Call external reset function if provided
    if (onReset) {
      onReset();
    }
    onClose();
  };

  const handleApplyFilters = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    if (selectedGenres.length > 0) filters.genre = selectedGenres;
    if (minRating) filters.minRating = parseFloat(minRating);
    if (maxRating) filters.maxRating = parseFloat(maxRating);
    if (releaseDateGte) filters.releaseDateGte = releaseDateGte;
    if (releaseDateLte) filters.releaseDateLte = releaseDateLte;
    if (sortBy) filters.sortBy = sortBy;

    onFilter(filters);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Filter Movies
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Apply filters to refine the movie list and find exactly what
            you&apos;re looking for.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Movie Genres
            </Label>
            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
              <GenreSelector
                selectedGenres={selectedGenres}
                onGenreChange={setSelectedGenres}
                multiple={true}
                placeholder="Select genres to filter by..."
                className="bg-white"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Rating Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minRating" className="text-xs text-gray-500">
                  Minimum Rating
                </Label>
                <Input
                  type="number"
                  id="minRating"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  placeholder="e.g., 7.0"
                  min="0"
                  max="10"
                  step="0.1"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxRating" className="text-xs text-gray-500">
                  Maximum Rating
                </Label>
                <Input
                  type="number"
                  id="maxRating"
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value)}
                  placeholder="e.g., 9.5"
                  min="0"
                  max="10"
                  step="0.1"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Release Date Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="releaseDateGte"
                  className="text-xs text-gray-500"
                >
                  Released After
                </Label>
                <Input
                  type="date"
                  id="releaseDateGte"
                  value={releaseDateGte}
                  onChange={(e) => setReleaseDateGte(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="releaseDateLte"
                  className="text-xs text-gray-500"
                >
                  Released Before
                </Label>
                <Input
                  type="date"
                  id="releaseDateLte"
                  value={releaseDateLte}
                  onChange={(e) => setReleaseDateLte(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="sortBy"
              className="text-sm font-medium text-gray-700"
            >
              Sort Order
            </Label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex h-11 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 font-medium ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
            >
              <option value="popularity.desc">🔥 Most Popular</option>
              <option value="popularity.asc">📈 Least Popular</option>
              <option value="release_date.desc">🗓️ Newest First</option>
              <option value="release_date.asc">📅 Oldest First</option>
              <option value="vote_average.desc">⭐ Highest Rated</option>
              <option value="vote_average.asc">📊 Lowest Rated</option>
            </select>
          </div>
        </div>
        <DialogFooter className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleResetFilters}
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            Reset Filters
          </Button>
          <Button
            type="button"
            onClick={handleApplyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm px-6"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MovieFilter;
