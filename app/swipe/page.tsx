"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X, ArrowRight } from "lucide-react"
import { SwipeCard } from "@/components/swipe-card"

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
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
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Swipe on Recommendations</h1>
        <p className="text-muted-foreground mt-2">Like or dislike these recommendations based on your taste</p>
        <div className="mt-4 text-sm">
          <span className="font-medium">{currentIndex}</span> of{" "}
          <span className="font-medium">{recommendedMovies.length}</span> recommendations
        </div>
      </div>

      {recommendedMovies.length > 0 && currentIndex < recommendedMovies.length ? (
        <div className="relative mb-8">
          <SwipeCard movie={recommendedMovies[currentIndex]} />

          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full h-14 w-14 bg-red-50 border-red-200 hover:bg-red-100 hover:text-red-600"
              onClick={handleDislike}
            >
              <X className="h-6 w-6 text-red-500" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full h-14 w-14 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:text-blue-600"
              onClick={() => {
                if (currentIndex < recommendedMovies.length) {
                  setNotWatchedMovies([...notWatchedMovies, recommendedMovies[currentIndex]])
                  setCurrentIndex(currentIndex + 1)
                }
              }}
            >
              <ArrowRight className="h-6 w-6 text-blue-500" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full h-14 w-14 bg-green-50 border-green-200 hover:bg-green-100 hover:text-green-600"
              onClick={handleLike}
            >
              <Check className="h-6 w-6 text-green-500" />
            </Button>
          </div>
        </div>
      ) : (
        <Card className="mb-8">
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
      )}

      <div className="flex justify-between">
        <div className="text-center">
          <div className="text-sm font-medium">Liked</div>
          <div className="text-2xl font-bold text-green-500">{likedMovies.length}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">Disliked</div>
          <div className="text-2xl font-bold text-red-500">{dislikedMovies.length}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">Not Watched</div>
          <div className="text-2xl font-bold text-blue-500">{notWatchedMovies.length}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">Remaining</div>
          <div className="text-2xl font-bold">{recommendedMovies.length - currentIndex}</div>
        </div>
      </div>

      {currentIndex > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={handleFinish}>
            Skip to Results
          </Button>
        </div>
      )}
    </div>
  )
}

