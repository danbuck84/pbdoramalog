/**
 * Tipos para resposta da API do TMDB (The Movie Database)
 * Documentação: https://developers.themoviedb.org/3
 */

export interface TMDBSearchResult {
    page: number;
    results: TMDBShow[];
    total_pages: number;
    total_results: number;
}

export interface TMDBShow {
    id: number;
    name: string; // Título do show
    original_name: string;
    overview: string; // Sinopse
    poster_path: string | null; // Caminho do poster (ex: "/abc123.jpg")
    backdrop_path: string | null;
    first_air_date: string; // Data de estreia (YYYY-MM-DD)
    vote_average: number; // Nota média (0-10)
    vote_count: number;
    popularity: number;
    origin_country: string[]; // Ex: ["KR"] para Coreia
    original_language: string; // Ex: "ko"
    genre_ids: number[];
}

export interface TMDBShowDetails extends TMDBShow {
    number_of_episodes: number;
    number_of_seasons: number;
    status: string; // "Ended", "Returning Series", etc.
    tagline: string;
    genres: { id: number; name: string }[];
}
