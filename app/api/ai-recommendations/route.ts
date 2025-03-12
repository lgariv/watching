import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const ai = new OpenAI({
	baseURL: process.env.OPENAI_BASE_URL,
	apiKey: process.env.OPENAI_API_KEY,
});

interface Movie {
  id: number
  title?: string
  name?: string
  poster_path: string
  overview: string
  release_date: string
  media_type: "movie" | "tv"
}

export async function POST(request: Request) {
	try {
		const { selectedMovies, likedMovies, dislikedMovies, notWatchedMovies } =
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
			likedMovies: (likedMovies || []).map((m: Movie) => ({
				title: m.title || m.name,
				type: m.media_type,
				id: m.id,
			})),
			dislikedMovies: (dislikedMovies || []).map((m: Movie) => ({
				title: m.title || m.name,
				type: m.media_type,
				id: m.id,
			})),
			notWatchedMovies: (notWatchedMovies || []).map((m: Movie) => ({
				title: m.title || m.name,
				type: m.media_type,
				id: m.id,
			})),
		};

		// System Prompt
		const systemPrompt = `
			You are a movie and TV show recommendation expert.
			You must respond ONLY with a valid JSON array of objects.
			Each object must have exactly the fields: title, media_type, and reason.
			Do not include any additional text, markdown formatting, or explanations.
			You will always recommend exactly 5 movies and 5 tv shows at a time.
			You will never recommend the same movie or tv show twice.
			You will never recommend a movie or tv show that the user has already seen, liked, or disliked.
			Consider the 'Not Watched Yet' list only if those titles strongly match the user's tastes, but do not prioritize them.
			Prioritize well-known titles and newer releases in the recommendations, but most importantly focus strongly on matching the user's tastes.
		`;

		// User Prompt
		const userPrompt = `
			Your task is to deeply analyze the user's preferences to identify the themes, styles, tones, and aesthetics they enjoy, while recognizing elements they dislike.

			User Data:
			- Favorites: ${JSON.stringify(movieData.selectedMovies)}
			- Liked Recommendations: ${JSON.stringify(movieData.likedMovies)}
			- Disliked Recommendations: ${JSON.stringify(movieData.dislikedMovies)}
			- Not Watched Yet List: ${JSON.stringify(movieData.notWatchedMovies)}

			Process:
			1. Analyze Favorites & Liked Recommendations:
			- Identify recurring genres, tones, pacing, themes, narrative styles, cinematography, and emotional cues.
			- Favorites are the user's top choice and their attributes are the most important, while Liked Recommendations provide additional insights.
			2. Analyze Disliked Recommendations:
			- Determine which traits the user tends to avoid (e.g., specific genres, pacing, or themes).
			3. Incorporate 'Not Watched Yet' List:
			- Use titles from this list only if they strongly align with user preferences.
			4. Curate the Best Matches:
			- Select recommendations that reflect the user's preferred attributes, focusing on well-known, newer releases.
			5. Generate Output in JSON:
			- Provide exactly 5 movies and 5 TV shows in a JSON array.
			- Each recommendation must include the title, media_type (movie or tv), and reason.
			- Return the JSON array without additional explanations.
		`;

		const response = await ai.chat.completions.create({
			model: "deepseek-chat",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			temperature: 0.3,
			max_tokens: 800,
			response_format: { type: "json_object" }
		});

		let recommendations;
		try {
			recommendations = JSON.parse(response.choices[0].message.content!).recommendations;
			
			if (!Array.isArray(recommendations)) {
				throw new Error('Recommendations is not an array');
			}
			
			if (recommendations.length === 0) {
				throw new Error('Recommendations array is empty');
			}
		} catch (error) {
			console.error("JSON parsing error:", error);
			return NextResponse.json(
				{ error: "Failed to generate valid recommendations" },
				{ status: 500 }
			);
		}

		// Batch TMDB API calls in groups of 3 to avoid rate limits
		const batchSize = 3;
		const detailedRecommendations = [];
		
		for (let i = 0; i < recommendations.length; i += batchSize) {
			const batch = recommendations.slice(i, i + batchSize);
			const batchResults = await Promise.all(
				batch.map(async (rec: any) => {
					try {
						const searchUrl = `https://api.themoviedb.org/3/search/${
							rec.media_type
						}?api_key=${
							process.env.TMDB_API_KEY
						}&query=${encodeURIComponent(
							rec.title
						)}&include_adult=false&language=en-US&page=1`;
						
						const searchResponse = await fetch(
							searchUrl,
							{
								headers: {
									"Content-Type": "application/json",
									"Authorization": `Bearer ${process.env.TMDB_API_KEY}`
								},
								cache: 'force-cache'
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
						}
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
			detailedRecommendations.push(...batchResults);
			
			if (i + batchSize < recommendations.length) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
		}
		
		if (detailedRecommendations.length === 0) {
			return NextResponse.json(
				{ error: "No recommendations could be generated" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ 
			recommendations: detailedRecommendations,
			count: detailedRecommendations.length 
		});
	} catch (error) {
		console.error("Error generating AI recommendations:", error);
		return NextResponse.json(
			{ 
				error: "Failed to generate recommendations", 
				details: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
}
