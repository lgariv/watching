import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const type = searchParams.get("type")

  if (!id || !type) {
    return NextResponse.json({ error: "ID and type parameters are required" }, { status: 400 })
  }

  try {
    // Get recommendations for the specific movie or TV show
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
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

    // Add media_type to each result
    const resultsWithType = data.results.map((item: any) => ({
      ...item,
      media_type: type,
    }))

    return NextResponse.json({ results: resultsWithType })
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}

