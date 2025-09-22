"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clapperboard,
  Star,
  Users,
  LogOut,
  LayoutDashboard,
  Bookmark,
} from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/"); // Refresh the page to reflect logged-out state
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-xl text-gray-400"
          >
            <Clapperboard className="h-6 w-6 text-blue-500" />
            <span className="text-gray-800">MovieRecs</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="outline">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline">
                  <Link href="/watchlists">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Watchlists
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost">
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button>
                  <Link href="/auth/register">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 md:px-6 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-gray-300">
            Discover Your Next Favorite Movie
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-500 mb-8">
            MovieRecs uses your unique taste to provide personalized movie
            recommendations. Stop searching, start watching.
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Button size="lg">
                <Link href="/dashboard">
                  Go to Your Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg">
                  <Link href="/auth/register">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <Link href="/dashboard">Explore Popular Movies</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-300">
                How It Works
              </h2>
              <p className="text-lg text-gray-500 mt-4">
                A simple, fun way to find movies you&apos;ll love.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <Star className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-400">
                  Rate Movies
                </h3>
                <p className="text-gray-500">
                  Tell us what you think about movies you&apos;ve seen. The more
                  you rate, the better your recommendations become.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-400">
                  Set Preferences
                </h3>
                <p className="text-gray-500">
                  Fine-tune your recommendations by selecting your favorite
                  genres, actors, and directors.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 rounded-full p-4 mb-4">
                  <Clapperboard className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-400">
                  Get Recommendations
                </h3>
                <p className="text-gray-500">
                  Receive a constantly updated list of movies tailored just for
                  you. Discover hidden gems and new releases.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} MovieRecs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
