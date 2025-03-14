"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Star, Calendar, Film, Tv } from "lucide-react"

interface Movie {
  id: number
  title?: string
  name?: string
  poster_path: string
  overview: string
  release_date: string
  media_type: "movie" | "tv"
  vote_average?: number
}

interface Recommendation {
  title: string
  media_type: "movie" | "tv"
  id: number
  poster_path: string
  overview: string
  release_date?: string
  first_air_date?: string
  vote_average: number
  reason: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([])
  const [likedMovies, setLikedMovies] = useState<Movie[]>([])
  const [dislikedMovies, setDislikedMovies] = useState<Movie[]>([])
  const [notWatchedMovies, setNotWatchedMovies] = useState<Movie[]>([])

  useEffect(() => {
    // Load movies from localStorage
    const storedSelected = localStorage.getItem("selectedMovies")
    const storedLiked = localStorage.getItem("likedMovies")
    const storedDisliked = localStorage.getItem("dislikedMovies")
    const storedNotWatched = localStorage.getItem("notWatchedMovies")
    
    // Parse stored movies if available
    const selected = storedSelected ? JSON.parse(storedSelected) : []
    const liked = storedLiked ? JSON.parse(storedLiked) : []
    const disliked = storedDisliked ? JSON.parse(storedDisliked) : []
    const notWatched = storedNotWatched ? JSON.parse(storedNotWatched) : []
    
    // Update state with parsed data
    setSelectedMovies(selected)
    setLikedMovies(liked)
    setDislikedMovies(disliked)
    setNotWatchedMovies(notWatched)
    
    if (storedSelected) {
      // If we have movie preferences, always generate a new recommendation
      getAIRecommendations(selected, liked, disliked, notWatched)
    } else {
      // If no data at all, redirect to search
      router.push("/search")
    }
  }, [router])

  const getAIRecommendations = async (selected: Movie[], liked: Movie[], disliked: Movie[], notWatched: Movie[]) => {
    try {
      const response = await fetch("/api/ai-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedMovies: selected,
          likedMovies: liked,
          dislikedMovies: disliked,
          notWatchedMovies: notWatched,
        }),
        cache: 'no-store', // Don't cache this request
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Failed to generate AI recommendations due to rate limiting. Please try again later."
          );
        }
        throw new Error("Failed to get AI recommendations");
      }

      const data = await response.json();
      
      // If the response includes an ID, redirect to it without saving to localStorage
      if (data.id) {
        router.push(`/results/${data.id}`);
      } else {
        // If no ID was returned, redirect to search as fallback
        router.push("/search");
      }
    } catch (error) {
      console.error("Error getting AI recommendations:", error)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold text-center mb-2">Generating Your Recommendations</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Our AI is analyzing your preferences to create personalized recommendations just for you.
      </p>
    </div>
  )
}

