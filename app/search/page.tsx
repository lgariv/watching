"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { MovieSearchResult } from "@/components/movie-search-result"

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  media_type: "movie" | "tv"
}

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      // Check if data.results exists before trying to slice it
      if (data && data.results && Array.isArray(data.results)) {
        setSearchResults(data.results.slice(0, 20))
      } else {
        // If no results or results is not an array, set an empty array
        console.log("No results found or invalid response format:", data)
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error searching:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMovie = (movie: Movie) => {
    if (selectedMovies.length < 10 && !selectedMovies.some((m) => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie])
      setSearchResults([])
      setSearchQuery("")
    }
  }

  const handleRemoveMovie = (movieId: number) => {
    setSelectedMovies(selectedMovies.filter((movie) => movie.id !== movieId))
  }

  const handleContinue = () => {
    if (selectedMovies.length > 0) {
      // Store selected movies in localStorage or state management
      localStorage.setItem("selectedMovies", JSON.stringify(selectedMovies))
      router.push("/swipe")
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Search Your Favorites</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Search for up to 10 movies or TV shows you love to get started
      </p>

      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a movie or TV show..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
            {isLoading ? "Searching..." : <Search className="h-4 w-4" />}
          </Button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {searchResults.map((movie) => (
              <MovieSearchResult key={movie.id} movie={movie} onSelect={() => handleSelectMovie(movie)} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Selected ({selectedMovies.length}/10)</h2>
        {selectedMovies.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No movies or shows selected yet. Search and select up to 10 titles you enjoy.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {selectedMovies.map((movie) => (
              <Card key={movie.id} className="overflow-hidden">
                <CardContent className="p-0 relative">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/placeholder.svg?height=150&width=100"
                    }
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveMovie(movie.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="p-2 text-xs font-medium truncate">{movie.title}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button onClick={handleContinue} disabled={selectedMovies.length === 0} size="lg">
          Continue to Recommendations
        </Button>
      </div>
    </div>
  )
}

