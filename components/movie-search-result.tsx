import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardFooter, CardHeader, Image } from "@heroui/react"
import { Badge } from "@/components/ui/badge"

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
    <Card isFooterBlurred className="w-fit col-span-1">
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <Badge variant="secondary" className="absolute top-1 left-2 capitalize">
          {movie.media_type}
        </Badge>
      </CardHeader>
      <Image
        removeWrapper
        width={200}
        alt="Card example background"
        className="z-0 w-full h-full object-cover"
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.svg?height=150&width=100"
        }
      />
      <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
        <div className="flex flex-col justify-end w-full">
          <h3 className="text-white font-medium line-clamp-2">{title}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-white/80 text-sm">{year}</span>
            <Button size="sm" variant="secondary" className="h-8 w-8 rounded-full p-0" onClick={onSelect}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add to selection</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

