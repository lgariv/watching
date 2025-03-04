import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  media_type: "movie" | "tv"
}

interface MovieSearchResultProps {
  movie: Movie
  onSelect: () => void
}

export function MovieSearchResult({ movie, onSelect }: MovieSearchResultProps) {
  // Handle different property names from TMDB API
  const title = movie.title || movie.name || "Unknown Title"
  const releaseDate = movie.release_date || movie.first_air_date || "Unknown Date"
  const year = releaseDate ? new Date(releaseDate).getFullYear() : ""

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder.svg?height=150&width=100"
          }
          alt={title}
          className="w-full aspect-[2/3] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3">
          <h3 className="text-white font-medium line-clamp-2">{title}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-white/80 text-sm">{year}</span>
            <Button size="sm" variant="secondary" className="h-8 w-8 rounded-full p-0" onClick={onSelect}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add to selection</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

