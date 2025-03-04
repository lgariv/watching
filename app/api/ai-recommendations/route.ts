import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const ai = new OpenAI({
	baseURL: process.env.OPENAI_BASE_URL,
	apiKey: process.env.OPENAI_API_KEY,
});

interface Movie {
	id: number;
	title: string;
	poster_path: string;
	overview: string;
	release_date: string;
	media_type: "movie" | "tv";
}

export async function POST(request: Request) {
	try {
		const { selectedMovies, likedMovies, dislikedMovies } =
			await request.json();

		if (!selectedMovies || !selectedMovies.length) {
			return NextResponse.json(
				{ error: "Selected movies are required" },
				{ status: 400 }
			);
		}

		// Prepare data for OpenAI
		const movieData = {
			selectedMovies: selectedMovies.map((m: Movie) => ({
				title: m.title || m.name,
				type: m.media_type,
				id: m.id,
			})),
			likedMovies: likedMovies.map((m: Movie) => ({
				title: m.title || m.name,
				type: m.media_type,
				id: m.id,
			})),
			dislikedMovies: dislikedMovies.map((m: Movie) => ({
				title: m.title || m.name,
				type: m.media_type,
				id: m.id,
			})),
		};

		// Generate AI recommendations
		const prompt = `
      You are a movie and TV show recommendation expert. Based on the user's preferences, suggest 5 movies or TV shows they might enjoy.
      
      The user has selected these movies/shows as their favorites:
      ${JSON.stringify(movieData.selectedMovies)}
      
      The user liked these recommended movies/shows:
      ${JSON.stringify(movieData.likedMovies)}
      
      The user disliked these recommended movies/shows:
      ${JSON.stringify(movieData.dislikedMovies)}
      
      Please provide 5 movie and 5 show recommendations with the following information for each:
      1. Title
      2. Media type (movie or tv)
      3. A brief reason why you're recommending it based on their preferences
      
      Format your response as a JSON array with objects containing: title, media_type, and reason fields.
      Do not include any explanatory text outside the JSON array.
    `;

    // Replace mock data with OpenAI API call
    const response = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a movie and TV show recommendation expert. Provide recommendations in JSON format only, which you should send as a javascript-ready string/text (without ``` syntax). Your recommendations and their quality is highly important, so please make sure to provide the best recommendations possible to be rewarded with a high rating.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });
  
    let recommendations;
    try {
      recommendations = JSON.parse(response.choices[0].message.content!);
    } catch (error) {
      console.error("Initial parsing error:", error);
      
      // Try to fix the JSON format using a second AI call
      const fixResponse = await ai.chat.completions.create({
			model: "deepseek-chat",
			messages: [
				{
					role: "system",
					content:
						"You are a JSON formatting expert. Format the following content as valid JSON array containing objects with title, media_type, and reason fields only. Provide recommendations in JSON format only, which you should send as a javascript-ready string/text (without ``` syntax or any other text)",
				},
				{
					role: "user",
					content: `Fix this JSON: ${response.choices[0].message.content}`,
				},
			],
			temperature: 0.1,
			max_tokens: 800,
		});

      try {
        recommendations = JSON.parse(fixResponse.choices[0].message.content!);
      } catch (secondError) {
        console.error("Error parsing fixed response:", secondError);
        return NextResponse.json(
          { error: "Failed to parse AI recommendations" },
          { status: 500 }
        );
      }
    }

		// Fetch additional details for each recommendation from TMDB
		const detailedRecommendations = await Promise.all(
			recommendations.map(async (rec: any) => {
				try {
					// Search for the movie/show to get its ID
					const searchResponse = await fetch(
						`https://api.themoviedb.org/3/search/${
							rec.media_type
						}?api_key=${
							process.env.TMDB_API_KEY
						}&query=${encodeURIComponent(
							rec.title
						)}&include_adult=false&language=en-US&page=1`,
						{
							headers: {
								"Content-Type": "application/json",
							},
						}
					);

					if (!searchResponse.ok) {
						throw new Error(
							`TMDB API error: ${searchResponse.status}`
						);
					}

					const searchData = await searchResponse.json();

					if (searchData.results && searchData.results.length > 0) {
						const bestMatch = searchData.results[0];

						return {
							title: bestMatch.title || bestMatch.name,
							media_type: rec.media_type,
							id: bestMatch.id,
							poster_path: bestMatch.poster_path,
							overview: bestMatch.overview,
							release_date:
								bestMatch.release_date ||
								bestMatch.first_air_date,
							vote_average: bestMatch.vote_average || 0,
							reason: rec.reason,
						};
					} else {
						// If no match found, return the original recommendation
						return {
							title: rec.title,
							media_type: rec.media_type,
							id: Math.random().toString(36).substr(2, 9),
							poster_path: null,
							overview: "No overview available",
							release_date: null,
							vote_average: 0,
							reason: rec.reason,
						};
					}
				} catch (error) {
					console.error(
						`Error fetching details for ${rec.title}:`,
						error
					);
					return {
						title: rec.title,
						media_type: rec.media_type,
						id: Math.random().toString(36).substr(2, 9),
						poster_path: null,
						overview: "No overview available",
						release_date: null,
						vote_average: 0,
						reason: rec.reason,
					};
				}
			})
		);

		return NextResponse.json({ recommendations: detailedRecommendations });
	} catch (error) {
		console.error("Error generating AI recommendations:", error);
		return NextResponse.json(
			{ error: "Failed to generate recommendations" },
			{ status: 500 }
		);
	}
}
