"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/lib/api/user";
import { GenreGrid } from "@/components/GenreGrid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Settings, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function GenresPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // State for user preferences
  const [userPreferences, setUserPreferences] = useState<number[]>([]);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // State for grid demo
  const [selectedGridGenres, setSelectedGridGenres] = useState<number[]>([]);

  // Load user preferences on mount if authenticated
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoadingPreferences(true);
        const preferences = await userApi.getPreferences();
        setUserPreferences(preferences.favoriteGenres || []);
        setSelectedGridGenres(preferences.favoriteGenres || []);
      } catch (error) {
        console.warn("Could not load user preferences:", error);
        // Don't show error toast as user might not have preferences yet
      } finally {
        setIsLoadingPreferences(false);
      }
    };

    loadUserPreferences();
  }, [isAuthenticated]);

  const handleGridGenreSelect = (genreId: number) => {
    setSelectedGridGenres((prev) => [...prev, genreId]);
  };

  const handleGridGenreDeselect = (genreId: number) => {
    setSelectedGridGenres((prev) => prev.filter((id) => id !== genreId));
  };

  const handleSavePreferences = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save preferences");
      router.push("/auth/login");
      return;
    }

    if (selectedGridGenres.length === 0) {
      toast.error("Please select at least one genre");
      return;
    }

    try {
      setIsSavingPreferences(true);
      await userApi.updateGenrePreferences(selectedGridGenres);
      setUserPreferences(selectedGridGenres);
      toast.success(
        `Genre preferences saved! (${selectedGridGenres.length} genres selected)`,
      );
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const clearGridSelection = () => {
    setSelectedGridGenres([]);
  };

  const resetToUserPreferences = () => {
    setSelectedGridGenres([...userPreferences]);
  };

  const hasUnsavedChanges =
    isAuthenticated &&
    JSON.stringify(selectedGridGenres.sort()) !==
      JSON.stringify(userPreferences.sort());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Movie Genres
              </h1>
            </div>

            {/* Save indicator and Preferences Link */}
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <div className="text-sm text-orange-600">Unsaved changes</div>
              )}
              <Button
                variant="outline"
                onClick={() => router.push("/preferences")}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Full Preferences
              </Button>
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
                Genre Management
              </CardTitle>
              <CardDescription>
                Explore movie genres and set your preferences for personalized
                recommendations.
                {isAuthenticated
                  ? " Your preferences will be used to suggest movies you might enjoy."
                  : " Log in to save your preferences and get personalized recommendations."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Complete Preferences
                  </h3>
                  <p className="text-sm text-blue-700">
                    Set up your favorite actors, directors, languages, and
                    rating preferences for better recommendations.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/preferences")}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Open Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Authentication prompt for unauthenticated users */}
          {!isAuthenticated && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Get Personalized Recommendations
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Log in to save your genre preferences and receive movie
                    recommendations tailored to your taste.
                  </p>
                  <Button onClick={() => router.push("/auth/login")}>
                    Log In
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Preferences Section */}
          {isAuthenticated && (
            <Card>
              <CardHeader>
                <CardTitle>Your Genre Preferences</CardTitle>
                <CardDescription>
                  Select genres you enjoy to get better movie recommendations.
                  {userPreferences.length > 0 &&
                    ` You currently have ${userPreferences.length} genre(s) selected.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingPreferences ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading your preferences...</span>
                  </div>
                ) : (
                  <>
                    <GenreGrid
                      selectedGenres={selectedGridGenres}
                      onGenreSelect={handleGridGenreSelect}
                      onGenreDeselect={handleGridGenreDeselect}
                      multiSelect={true}
                      title="Select Your Favorite Genres"
                      description="Choose multiple genres that interest you for personalized recommendations"
                    />

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      {selectedGridGenres.length > 0 && (
                        <Button
                          onClick={handleSavePreferences}
                          disabled={isSavingPreferences || !hasUnsavedChanges}
                          className="flex items-center gap-2"
                        >
                          {isSavingPreferences ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Save Preferences ({selectedGridGenres.length}{" "}
                              selected)
                            </>
                          )}
                        </Button>
                      )}

                      {selectedGridGenres.length > 0 && (
                        <Button variant="outline" onClick={clearGridSelection}>
                          Clear All
                        </Button>
                      )}

                      {userPreferences.length > 0 && hasUnsavedChanges && (
                        <Button
                          variant="ghost"
                          onClick={resetToUserPreferences}
                        >
                          Reset to Saved
                        </Button>
                      )}
                    </div>

                    {/* Current preferences display */}
                    {userPreferences.length > 0 && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">
                          Your Saved Preferences
                        </h4>
                        <p className="text-sm text-green-700">
                          You have {userPreferences.length} genre(s) saved.
                          These preferences are used to personalize your movie
                          recommendations.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
