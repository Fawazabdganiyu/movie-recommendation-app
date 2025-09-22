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
}

const MovieFilter: React.FC<MovieFilterProps> = ({
  open,
  onClose,
  onFilter,
}) => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [releaseDateGte, setReleaseDateGte] = useState("");
  const [releaseDateLte, setReleaseDateLte] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  const handleApplyFilters = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    if (selectedGenres.length > 0) filters.genreIds = selectedGenres.join(",");
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
          <DialogTitle>Filter Movies</DialogTitle>
          <DialogDescription>
            Apply filters to refine the movie list.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Genres</Label>
            <GenreSelector
              selectedGenres={selectedGenres}
              onGenreChange={setSelectedGenres}
              multiple={true}
              placeholder="Select genres to filter"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minRating">Min Rating</Label>
              <Input
                type="number"
                id="minRating"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                placeholder="e.g., 7.0"
              />
            </div>
            <div>
              <Label htmlFor="maxRating">Max Rating</Label>
              <Input
                type="number"
                id="maxRating"
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
                placeholder="e.g., 9.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="releaseDateGte">Release After</Label>
              <Input
                type="date"
                id="releaseDateGte"
                value={releaseDateGte}
                onChange={(e) => setReleaseDateGte(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="releaseDateLte">Release Before</Label>
              <Input
                type="date"
                id="releaseDateLte"
                value={releaseDateLte}
                onChange={(e) => setReleaseDateLte(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortBy">Sort By</Label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="popularity.desc">Popularity Descending</option>
              <option value="popularity.asc">Popularity Ascending</option>
              <option value="release_date.desc">Release Date Descending</option>
              <option value="release_date.asc">Release Date Ascending</option>
              <option value="vote_average.desc">Vote Average Descending</option>
              <option value="vote_average.asc">Vote Average Ascending</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MovieFilter;
