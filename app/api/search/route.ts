import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // Search for both movies and TV shows
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()

    // Filter to only include movies and TV shows
    const filteredResults = data.results.filter((item: any) => item.media_type === "movie" || item.media_type === "tv")

    return NextResponse.json({ results: filteredResults })
  } catch (error) {
    console.error("Error searching TMDB:", error)
    return NextResponse.json({ error: "Failed to search for movies and shows" }, { status: 500 })
  }
}

