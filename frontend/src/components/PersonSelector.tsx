"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Search, User, Film } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Person {
  id: number;
  name: string;
  profile_path?: string | null;
  known_for_department?: string;
  popularity?: number;
}

interface PersonSelectorProps {
  selectedPersons?: number[];
  onPersonChange: (personIds: number[]) => void;
  type: "actor" | "director";
  placeholder?: string;
  className?: string;
  title?: string;
  description?: string;
}

export const PersonSelector: React.FC<PersonSelectorProps> = ({
  selectedPersons = [],
  onPersonChange,
  type,
  placeholder = `Search for ${type}s...`,
  className = "",
  title,
  description,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [selectedPersonDetails, setSelectedPersonDetails] = useState<Person[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    const searchPersons = async (query: string) => {
      try {
        setIsSearching(true);
        setSearchError(null);

        // Mock TMDB API search for persons
        // In a real implementation, you'd call the TMDB API
        // https://api.themoviedb.org/3/search/person?query={query}

        // Mock data for demonstration
        const mockResults: Person[] = [
          {
            id: 1,
            name: `${query} Smith`,
            known_for_department: type === "actor" ? "Acting" : "Directing",
            popularity: 85.5,
            profile_path: "/mock-profile.jpg",
          },
          {
            id: 2,
            name: `${query} Johnson`,
            known_for_department: type === "actor" ? "Acting" : "Directing",
            popularity: 72.3,
            profile_path: "/mock-profile2.jpg",
          },
          {
            id: 3,
            name: `${query} Williams`,
            known_for_department: type === "actor" ? "Acting" : "Directing",
            popularity: 68.1,
            profile_path: null,
          },
        ].filter(
          (person) =>
            // Filter by department if specified
            !person.known_for_department ||
            (type === "actor" && person.known_for_department === "Acting") ||
            (type === "director" &&
              person.known_for_department === "Directing"),
        );

        setSearchResults(mockResults);
      } catch (error) {
        console.error(`Failed to search ${type}s:`, error);
        setSearchError(`Failed to search ${type}s. Please try again.`);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchPersons(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, type]);

  // Load details for selected persons
  useEffect(() => {
    const loadSelectedPersonDetails = async () => {
      if (selectedPersons.length === 0) {
        setSelectedPersonDetails([]);
        return;
      }

      try {
        // In a real app, you'd fetch person details from TMDB API
        // For now, we'll use mock data or cached results
        const details = selectedPersons.map((id) => ({
          id,
          name: `${type === "actor" ? "Actor" : "Director"} ${id}`,
          known_for_department: type === "actor" ? "Acting" : "Directing",
        }));
        setSelectedPersonDetails(details);
      } catch (error) {
        console.error(`Failed to load ${type} details:`, error);
      }
    };

    loadSelectedPersonDetails();
  }, [selectedPersons, type]);

  const searchPersons = async (query: string) => {
    try {
      setIsSearching(true);
      setSearchError(null);

      // Mock TMDB API search for persons
      // In a real implementation, you'd call the TMDB API
      // https://api.themoviedb.org/3/search/person?query={query}

      // Mock data for demonstration
      const mockResults: Person[] = [
        {
          id: 1,
          name: `${query} Smith`,
          known_for_department: type === "actor" ? "Acting" : "Directing",
          popularity: 85.5,
          profile_path: "/mock-profile.jpg",
        },
        {
          id: 2,
          name: `${query} Johnson`,
          known_for_department: type === "actor" ? "Acting" : "Directing",
          popularity: 72.3,
          profile_path: "/mock-profile2.jpg",
        },
        {
          id: 3,
          name: `${query} Williams`,
          known_for_department: type === "actor" ? "Acting" : "Directing",
          popularity: 68.1,
          profile_path: null,
        },
      ].filter(
        (person) =>
          // Filter by department if specified
          !person.known_for_department ||
          (type === "actor" && person.known_for_department === "Acting") ||
          (type === "director" && person.known_for_department === "Directing"),
      );

      setSearchResults(mockResults);
    } catch (error) {
      console.error(`Failed to search ${type}s:`, error);
      setSearchError(`Failed to search ${type}s. Please try again.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePersonSelect = (person: Person) => {
    if (selectedPersons.includes(person.id)) {
      // Remove if already selected
      onPersonChange(selectedPersons.filter((id) => id !== person.id));
    } else {
      // Add to selection
      onPersonChange([...selectedPersons, person.id]);
    }

    // Clear search after selection
    setSearchQuery("");
    setSearchResults([]);
  };

  const removePerson = (personId: number) => {
    onPersonChange(selectedPersons.filter((id) => id !== personId));
  };

  const clearAll = () => {
    onPersonChange([]);
  };

  const getPersonName = (personId: number): string => {
    const person = selectedPersonDetails.find((p) => p.id === personId);
    return person
      ? person.name
      : `${type === "actor" ? "Actor" : "Director"} ${personId}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {type === "actor" ? (
                <User className="h-5 w-5" />
              ) : (
                <Film className="h-5 w-5" />
              )}
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* Search Results Dropdown */}
        {(searchResults.length > 0 || searchError) && (
          <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto border shadow-lg">
            <CardContent className="p-2">
              {searchError ? (
                <div className="text-sm text-red-500 p-2">{searchError}</div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((person) => {
                    const isSelected = selectedPersons.includes(person.id);
                    return (
                      <button
                        key={person.id}
                        onClick={() => handlePersonSelect(person)}
                        className={`w-full flex items-center gap-3 p-2 rounded-md text-left hover:bg-gray-100 transition-colors ${
                          isSelected ? "bg-blue-50 border border-blue-200" : ""
                        }`}
                      >
                        {/* Profile Image Placeholder */}
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          {type === "actor" ? (
                            <User className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Film className="h-5 w-5 text-gray-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {person.name}
                          </div>
                          {person.known_for_department && (
                            <div className="text-xs text-gray-500">
                              {person.known_for_department}
                            </div>
                          )}
                          {person.popularity && (
                            <div className="text-xs text-gray-400">
                              Popularity: {person.popularity.toFixed(1)}
                            </div>
                          )}
                        </div>

                        {isSelected && (
                          <div className="text-blue-600 text-xs font-medium">
                            Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Persons */}
      {selectedPersons.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">
              Selected {type === "actor" ? "Actors" : "Directors"} (
              {selectedPersons.length})
            </h4>
            {selectedPersons.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedPersons.map((personId) => (
              <Badge
                key={personId}
                variant="secondary"
                className="flex items-center gap-2 pr-1"
              >
                <span className="text-sm">{getPersonName(personId)}</span>
                <button
                  onClick={() => removePerson(personId)}
                  className="ml-1 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${getPersonName(personId)}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {/* Usage Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            💡 These {type === "actor" ? "actors" : "directors"} will be used to
            personalize your movie recommendations.
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedPersons.length === 0 && !searchQuery && (
        <div className="text-center py-6 text-gray-500">
          <div className="mb-2">
            {type === "actor" ? (
              <User className="h-8 w-8 mx-auto text-gray-300" />
            ) : (
              <Film className="h-8 w-8 mx-auto text-gray-300" />
            )}
          </div>
          <p className="text-sm">
            Search and select your favorite{" "}
            {type === "actor" ? "actors" : "directors"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Start typing to search for{" "}
            {type === "actor" ? "actors" : "directors"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonSelector;
