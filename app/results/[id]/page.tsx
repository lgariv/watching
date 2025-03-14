"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Star, Calendar, Film, Tv, Share2 } from "lucide-react"

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
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch(`/api/recommendation/${params.id}`);
        const data = await response.json();

        if (data.error) {
          throw error;
        }

        if (!data) {
          throw new Error("Recommendation not found");
        }

        setRecommendations(data.result);
      } catch (err) {
        console.error("Error fetching recommendation:", err);
        setError("Failed to load recommendation. It may have been deleted or the link is invalid.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchRecommendation();
    } else {
      router.push("/");
    }
  }, [params.id, router]);

  const handleShareResults = () => {
    const url = `${window.location.origin}/results/${params.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Movie Recommendations',
        text: 'Check out these movies recommendations!',
        url: url,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy link:', err);
        });
    }
  };

  // Separate recommendations into movies and TV shows
  const movieRecommendations = recommendations.filter((rec) => rec.media_type === "movie")
  const tvRecommendations = recommendations.filter((rec) => rec.media_type === "tv")

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold text-center mb-2">Loading Recommendations</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Please wait while we retrieve your personalized recommendations.
        </p>
      </div>
    )
  }

  if (error || recommendations.length <= 0) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-36">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Recommendations</CardTitle>
            <CardDescription>We couldn't find your recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error || "No recommendations found with this ID. The link may be invalid or the data has been deleted."}</p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => router.push("/search")}
              className="flex items-center"
            >
              Start New Search
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                // Clear all localStorage data
                localStorage.removeItem("selectedMovies");
                localStorage.removeItem("likedMovies");
                localStorage.removeItem("dislikedMovies");
                localStorage.removeItem("notWatchedMovies");
                localStorage.removeItem("lastRecommendationId");
                router.push("/");
              }}
            >
              Return Home
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
    <div className="container max-w-6xl mx-auto px-4 py-8 pt-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Personalized Recommendations</h1>
        <p className="text-muted-foreground">
          Based on preferences, here are the top movies and shows you might enjoy
        </p>
        <div className="mt-4 gap-4 flex justify-center">
          <Button
            onClick={() => router.push("/search")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Start a New Search
          </Button>
          <Button 
            onClick={handleShareResults} 
            className="flex items-center gap-2"
            variant="outline"
          >
            <Share2 className="h-4 w-4" />
            Share These Results
          </Button>
        </div>
      </div>

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
    </div>
  )
} 