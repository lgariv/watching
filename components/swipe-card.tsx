import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Star } from "lucide-react"

interface Movie {
  id: number
  title?: string
  name?: string
  poster_path: string
  overview: string
  release_date: string
  first_air_date: string
  media_type: "movie" | "tv"
  vote_average?: number
}

interface SwipeCardProps {
  movie: Movie
}

export function SwipeCard({ movie }: SwipeCardProps) {
  // Handle different property names from TMDB API
  const title = movie.title || movie.name || "Unknown Title"
  const releaseDate = movie.release_date || movie.first_air_date || "Unknown Date"
  const year = releaseDate ? new Date(releaseDate).getFullYear() : ""

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="relative">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.svg?height=400&width=300"
            }
            alt={title}
            className="w-full aspect-[2/3] object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{year}</span>
            <Badge variant="outline" className="ml-2 capitalize">
              {movie.media_type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-4">{movie.overview}</p>
        </div>
      </CardContent>
    </Card>
  )
}

