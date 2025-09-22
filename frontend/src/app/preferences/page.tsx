"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/lib/api/user";
import { GenreGrid } from "@/components/GenreGrid";
import { PersonSelector } from "@/components/PersonSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ArrowLeft,
  Settings,
  Loader2,
  Save,
  Film,
  User,
  Globe,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

interface UserPreferences {
  favoriteGenres: number[];
  favoriteActors: number[];
  favoriteDirectors: number[];
  minRating: number;
  languages: string[];
}

const LANGUAGE_OPTIONS = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
];

export default function PreferencesPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Preferences state
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteGenres: [],
    favoriteActors: [],
    favoriteDirectors: [],
    minRating: 0,
    languages: ["en"],
  });

  // Original preferences for change detection
  const [originalPreferences, setOriginalPreferences] =
    useState<UserPreferences>({
      favoriteGenres: [],
      favoriteActors: [],
      favoriteDirectors: [],
      minRating: 0,
      languages: ["en"],
    });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access preferences");
      router.push("/auth/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const userPrefs = await userApi.getPreferences();

        const prefs: UserPreferences = {
          favoriteGenres: userPrefs.favoriteGenres || [],
          favoriteActors: userPrefs.favoriteActors || [],
          favoriteDirectors: userPrefs.favoriteDirectors || [],
          minRating: userPrefs.minRating || 0,
          languages: userPrefs.languages || ["en"],
        };

        setPreferences(prefs);
        setOriginalPreferences(prefs);
      } catch (error) {
        console.error("Failed to load preferences:", error);
        toast.error("Failed to load preferences");
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [isAuthenticated]);

  // Check if there are unsaved changes
  const hasUnsavedChanges =
    JSON.stringify(preferences) !== JSON.stringify(originalPreferences);

  // Handlers
  const handleGenreSelect = (genreId: number) => {
    setPreferences((prev) => ({
      ...prev,
      favoriteGenres: [...prev.favoriteGenres, genreId],
    }));
  };

  const handleGenreDeselect = (genreId: number) => {
    setPreferences((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.filter((id) => id !== genreId),
    }));
  };

  const handleActorsChange = (actorIds: number[]) => {
    setPreferences((prev) => ({
      ...prev,
      favoriteActors: actorIds,
    }));
  };

  const handleDirectorsChange = (directorIds: number[]) => {
    setPreferences((prev) => ({
      ...prev,
      favoriteDirectors: directorIds,
    }));
  };

  const handleMinRatingChange = (value: string) => {
    setPreferences((prev) => ({
      ...prev,
      minRating: parseFloat(value) || 0,
    }));
  };

  const handleLanguageToggle = (languageCode: string) => {
    setPreferences((prev) => {
      const languages = prev.languages.includes(languageCode)
        ? prev.languages.filter((lang) => lang !== languageCode)
        : [...prev.languages, languageCode];

      return {
        ...prev,
        languages: languages.length > 0 ? languages : ["en"], // Ensure at least one language
      };
    });
  };

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);

      await userApi.updatePreferences({
        favoriteGenres: preferences.favoriteGenres,
        favoriteActors: preferences.favoriteActors,
        favoriteDirectors: preferences.favoriteDirectors,
        minRating: preferences.minRating,
        languages: preferences.languages,
      });

      setOriginalPreferences(preferences);
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetChanges = () => {
    setPreferences(originalPreferences);
    toast.success("Changes reset");
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading preferences...</span>
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
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-gray-50 border-gray-300 text-gray-700 font-medium"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Preferences
              </h1>
            </div>

            {/* Save indicator */}
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <span className="text-sm text-orange-600">Unsaved changes</span>
              )}
              {hasUnsavedChanges && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetChanges}
                    disabled={isSaving}
                    className="border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Movie Preferences
              </CardTitle>
              <CardDescription>
                Customize your movie preferences to get personalized
                recommendations. Your preferences are used to suggest movies
                that match your taste.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Genre Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                Favorite Genres
              </CardTitle>
              <CardDescription>
                Select genres you enjoy watching. These will be prioritized in
                your recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenreGrid
                selectedGenres={preferences.favoriteGenres}
                onGenreSelect={handleGenreSelect}
                onGenreDeselect={handleGenreDeselect}
                multiSelect={true}
                title=""
                description=""
              />
              {preferences.favoriteGenres.length === 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  No genres selected. Select some genres to get better
                  recommendations.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actor Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Favorite Actors
              </CardTitle>
              <CardDescription>
                Choose actors whose movies you enjoy. We&apos;ll recommend more
                movies featuring them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonSelector
                selectedPersons={preferences.favoriteActors}
                onPersonChange={handleActorsChange}
                type="actor"
                placeholder="Search for actors..."
                title=""
                description=""
              />
            </CardContent>
          </Card>

          {/* Director Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                Favorite Directors
              </CardTitle>
              <CardDescription>
                Select directors whose work you admire. We&apos;ll recommend
                movies they&apos;ve directed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonSelector
                selectedPersons={preferences.favoriteDirectors}
                onPersonChange={handleDirectorsChange}
                type="director"
                placeholder="Search for directors..."
                title=""
                description=""
              />
            </CardContent>
          </Card>

          {/* Rating and Language Preferences */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Minimum Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Minimum Rating
                </CardTitle>
                <CardDescription>
                  Set the minimum rating for movie recommendations (0-10).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="minRating">
                    Minimum Rating: {preferences.minRating.toFixed(1)}
                  </Label>
                  <Input
                    id="minRating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={preferences.minRating}
                    onChange={(e) => handleMinRatingChange(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Movies with ratings below this threshold will be filtered
                    out from recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Language Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Preferred Languages
                </CardTitle>
                <CardDescription>
                  Select languages for movie recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGE_OPTIONS.map((language) => {
                      const isSelected = preferences.languages.includes(
                        language.code,
                      );
                      return (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageToggle(language.code)}
                          className={`p-2 text-left text-sm rounded-md border transition-colors ${
                            isSelected
                              ? "bg-blue-50 border-blue-200 text-blue-900"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {language.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500">
                    Selected:{" "}
                    {preferences.languages
                      .map(
                        (code) =>
                          LANGUAGE_OPTIONS.find((lang) => lang.code === code)
                            ?.name,
                      )
                      .join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences Summary</CardTitle>
              <CardDescription>Review your current preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900">Genres</h4>
                  <p className="text-gray-600">
                    {preferences.favoriteGenres.length} selected
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Actors</h4>
                  <p className="text-gray-600">
                    {preferences.favoriteActors.length} selected
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Directors</h4>
                  <p className="text-gray-600">
                    {preferences.favoriteDirectors.length} selected
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Settings</h4>
                  <p className="text-gray-600">
                    Min rating: {preferences.minRating.toFixed(1)}
                  </p>
                  <p className="text-gray-600">
                    Languages: {preferences.languages.length}
                  </p>
                </div>
              </div>

              {hasUnsavedChanges && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <p className="text-sm text-orange-800">
                    💡 You have unsaved changes. Click &quot;Save Changes&quot;
                    to apply your preferences.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
