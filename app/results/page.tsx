"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Star, Calendar, Film, Tv } from "lucide-react"

interface Movie {
  id: number
  title: string
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
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([])
  const [likedMovies, setLikedMovies] = useState<Movie[]>([])
  const [dislikedMovies, setDislikedMovies] = useState<Movie[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load all user preferences from localStorage
    const storedSelected = localStorage.getItem("selectedMovies")
    const storedLiked = localStorage.getItem("likedMovies")
    const storedDisliked = localStorage.getItem("dislikedMovies")

    if (storedSelected) {
      setSelectedMovies(JSON.parse(storedSelected))
    }

    if (storedLiked) {
      setLikedMovies(JSON.parse(storedLiked))
    }

    if (storedDisliked) {
      setDislikedMovies(JSON.parse(storedDisliked))
    }

    if (storedSelected || storedLiked) {
      getAIRecommendations(
        storedSelected ? JSON.parse(storedSelected) : [],
        storedLiked ? JSON.parse(storedLiked) : [],
        storedDisliked ? JSON.parse(storedDisliked) : [],
      )
    } else {
      router.push("/search")
    }
  }, [router])

  const getAIRecommendations = async (selected: Movie[], liked: Movie[], disliked: Movie[]) => {
    setIsLoading(true)
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
        }),
        cache: "force-cache"
      })

      if (!response.ok) {
        throw new Error("Failed to get AI recommendations")
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error("Error getting AI recommendations:", error)
      setError("Failed to generate recommendations. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartOver = () => {
    // Clear localStorage
    localStorage.removeItem("selectedMovies")
    localStorage.removeItem("likedMovies")
    localStorage.removeItem("dislikedMovies")
    router.push("/search")
  }

  // Separate recommendations into movies and TV shows
  const movieRecommendations = recommendations.filter((rec) => rec.media_type === "movie")
  const tvRecommendations = recommendations.filter((rec) => rec.media_type === "tv")

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Generating Your Recommendations</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Our AI is analyzing your preferences to create personalized recommendations just for you.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Something went wrong</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button 
              onClick={() => getAIRecommendations(selectedMovies, likedMovies, dislikedMovies)}
              className="flex items-center"
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={handleStartOver}>
              Start Over
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const renderRecommendationCard = (recommendation: Recommendation, index: number) => (
    <Card key={recommendation.id} className="overflow-hidden mb-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={
              recommendation.poster_path
                ? `https://image.tmdb.org/t/p/w500${recommendation.poster_path}`
                : "/placeholder.svg?height=300&width=200"
            }
            alt={recommendation.title}
            className="w-full aspect-[2/3] object-cover"
          />
        </div>
        <div className="p-4 md:w-2/3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-amber-500">
              <Star className="fill-amber-500 h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {recommendation.vote_average ? recommendation.vote_average.toFixed(1) : "N/A"}
              </span>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {new Date(recommendation.release_date || recommendation.first_air_date || "").getFullYear() || "N/A"}
              </span>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">
            {index + 1}. {recommendation.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{recommendation.overview}</p>
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">Why we recommend this:</p>
            <p>{recommendation.reason}</p>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Personalized Recommendations</h1>
        <p className="text-muted-foreground">
          Based on your preferences, here are the top movies and shows you might enjoy
        </p>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Movies Column */}
          <div>
            <div className="flex items-center mb-4">
              <Film className="h-5 w-5 mr-2" />
              <h2 className="text-2xl font-bold">Top Movies</h2>
            </div>
            {movieRecommendations.length > 0 ? (
              movieRecommendations.map((recommendation, index) => renderRecommendationCard(recommendation, index))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No movie recommendations available.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* TV Shows Column */}
          <div>
            <div className="flex items-center mb-4">
              <Tv className="h-5 w-5 mr-2" />
              <h2 className="text-2xl font-bold">Top TV Shows</h2>
            </div>
            {tvRecommendations.length > 0 ? (
              tvRecommendations.map((recommendation, index) => renderRecommendationCard(recommendation, index))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No TV show recommendations available.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">No recommendations available. Try selecting different movies or shows.</p>
            <Button onClick={handleStartOver}>Start Over</Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={handleStartOver} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  )
}

