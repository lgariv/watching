"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X, ArrowRight } from "lucide-react"
import { SwipeCard } from "@/components/swipe-card"

interface Movie {
  id: number
  title?: string
  name?: string
  poster_path: string
  overview: string
  release_date: string
  first_air_date: string
  media_type: "movie" | "tv"
}

export default function SwipePage() {
  const router = useRouter()
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([])
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedMovies, setLikedMovies] = useState<Movie[]>([])
  const [dislikedMovies, setDislikedMovies] = useState<Movie[]>([])
  const [notWatchedMovies, setNotWatchedMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load selected movies from localStorage
    const storedMovies = localStorage.getItem("selectedMovies")
    if (storedMovies) {
      const parsedMovies = JSON.parse(storedMovies)
      setSelectedMovies(parsedMovies)
      fetchRecommendations(parsedMovies)
    } else {
      router.push("/search")
    }
  }, [router])

  const fetchRecommendations = async (movies: Movie[]) => {
    setIsLoading(true)
    try {
      // Fetch recommendations for each selected movie
      const recommendationPromises = movies.map((movie) =>
        fetch(`/api/recommendations?id=${movie.id}&type=${movie.media_type}`).then((res) => res.json()),
      )

      const recommendationsResults = await Promise.all(recommendationPromises)

      // Flatten and deduplicate recommendations
      const allRecommendations = recommendationsResults.flatMap((result) => result.results || [])
      const uniqueRecommendations = Array.from(new Map(allRecommendations.map((movie) => [movie.id, movie])).values())

      // Filter out movies that were in the original selection
      const filteredRecommendations = uniqueRecommendations.filter(
        (rec) => !movies.some((movie) => movie.id === rec.id),
      )

      setRecommendedMovies(filteredRecommendations)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = () => {
    if (currentIndex < recommendedMovies.length) {
      setLikedMovies([...likedMovies, recommendedMovies[currentIndex]])
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleDislike = () => {
    if (currentIndex < recommendedMovies.length) {
      setDislikedMovies([...dislikedMovies, recommendedMovies[currentIndex]])
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleFinish = () => {
    // Store all user preferences
    localStorage.setItem("likedMovies", JSON.stringify(likedMovies))
    localStorage.setItem("dislikedMovies", JSON.stringify(dislikedMovies))
    localStorage.setItem("notWatchedMovies", JSON.stringify(notWatchedMovies))
    
    // Navigate to results - will always generate a fresh recommendation
    router.push("/results")
  }

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Finding recommendations...</h1>
          <p className="text-muted-foreground">
            Based on your selections, we're finding movies and shows you might enjoy.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-24 min-h-screen flex flex-col">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Swipe on Recommendations</h1>
        <p className="text-muted-foreground mt-2">Like or dislike these recommendations based on your taste</p>
        <div className="mt-4 mb-8 md:mb-0 lg:mb-2 text-sm">
          <span className="font-medium">{currentIndex}</span> of{" "}
          <span className="font-medium">{recommendedMovies.length}</span> recommendations
        </div>
      </div>

      {recommendedMovies.length > 0 && currentIndex < recommendedMovies.length ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-16 w-full max-w-9xl mx-auto md:mt-4 mb-6">
            {/* Stats Cards - Left Side */}
            <div className="md:col-span-4 order-3 md:order-1 grid grid-cols-3 gap-3 h-fit self-center">
              <div className="text-center bg-background/80 p-3 rounded-lg border shadow-sm">
                <div className="text-sm font-medium">Liked</div>
                <div className="text-2xl font-bold text-green-500">{likedMovies.length}</div>
              </div>
              <div className="text-center bg-background/80 p-3 rounded-lg border shadow-sm">
                <div className="text-sm font-medium">Not Watched</div>
                <div className="text-2xl font-bold text-blue-500">{notWatchedMovies.length}</div>
              </div>
              <div className="text-center bg-background/80 p-3 rounded-lg border shadow-sm">
                <div className="text-sm font-medium">Disliked</div>
                <div className="text-2xl font-bold text-red-500">{dislikedMovies.length}</div>
              </div>
            </div>
            
            {/* Poster Card - Center */}
            <div className="md:col-span-4 order-1 md:order-2 max-w-md mx-auto w-full">
              <SwipeCard movie={recommendedMovies[currentIndex]} />
            </div>
            
            {/* Action Buttons - Right Side */}
            <div className="md:col-span-3 flex md:flex-row justify-center md:justify-start items-center gap-8 order-2 md:order-3 self-center">
              <Button
                variant="outline"
                size="lg"
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white p-0 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[0_8px_25px_-5px_rgba(239,68,68,0.3)] dark:bg-zinc-900 dark:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_25px_-5px_rgba(239,68,68,0.4)]"
                onClick={handleDislike}
              >
                <span className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700"></span>
                <X className="h-6 w-6 text-red-500" />
                <span className="absolute -bottom-6 text-xs font-medium text-zinc-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-zinc-400">Dislike</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white p-0 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.3)] dark:bg-zinc-900 dark:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.4)]"
                onClick={() => {
                  if (currentIndex < recommendedMovies.length) {
                    setNotWatchedMovies([...notWatchedMovies, recommendedMovies[currentIndex]])
                    setCurrentIndex(currentIndex + 1)
                  }
                }}
              >
                <span className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700"></span>
                <ArrowRight className="h-6 w-6 text-blue-500" />
                <span className="absolute -bottom-6 text-xs font-medium text-zinc-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-zinc-400">Skip</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white p-0 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[0_8px_25px_-5px_rgba(34,197,94,0.3)] dark:bg-zinc-900 dark:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_25px_-5px_rgba(34,197,94,0.4)]"
                onClick={handleLike}
              >
                <span className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700"></span>
                <Check className="h-6 w-6 text-green-500" />
                <span className="absolute -bottom-6 text-xs font-medium text-zinc-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-zinc-400">Like</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="self-center mt-36">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">All done!</h3>
              <p className="text-muted-foreground mb-4">
                You've gone through all recommendations. Ready to see your personalized suggestions?
              </p>
              <Button onClick={handleFinish} size="lg">
                Get My Recommendations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

