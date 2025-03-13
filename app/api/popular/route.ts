import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Build the API URLs
    const movieUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`;
    const tvUrl = `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`;

    // Fetch both endpoints concurrently
    const [movieResponse, tvResponse] = await Promise.all([
      fetch(movieUrl, { headers: { "Content-Type": "application/json" } }),
      fetch(tvUrl, { headers: { "Content-Type": "application/json" } })
    ]);

    // Check responses
    if (!movieResponse.ok) {
      throw new Error(`TMDB API error (movies): ${movieResponse.status}`);
    }
    if (!tvResponse.ok) {
      throw new Error(`TMDB API error (TV): ${tvResponse.status}`);
    }

    // Parse JSON data
    const movieData = await movieResponse.json();
    const tvData = await tvResponse.json();

    // Add media_type to each item
    const moviesWithType = movieData.results.map((item: any) => ({
      ...item,
      media_type: "movie",
    }));
    const tvShowsWithType = tvData.results.map((item: any) => ({
      ...item,
      media_type: "tv",
    }));

    // Combine the results from movies and TV shows
    const combinedResults = [...moviesWithType, ...tvShowsWithType];

    // Shuffle the combined array using Fisher-Yates algorithm
    for (let i = combinedResults.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedResults[i], combinedResults[j]] = [combinedResults[j], combinedResults[i]];
    }

    // Select the first 10 items from the shuffled array
    const mixedTop10 = combinedResults.slice(0, 10);

    return NextResponse.json({ results: mixedTop10 });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
