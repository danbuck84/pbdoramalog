/**
 * Interface para os Doramas no PB DoramaLog
 * Define a estrutura de dados para tracking de doramas assistidos pelo casal
 */
export interface Drama {
    id: string; // TMDB ID
    title: string;
    poster_path: string;
    status: 'watching' | 'completed' | 'watchlist';
    chosenBy?: 'Dan' | 'Carol'; // Opcional para watchlist, obrigatório para watching
    ratings: {
        dan: number;   // 0 a 5
        carol: number; // 0 a 5
    };
    totalEpisodes: number;
    watchedEpisodes: number;
}
