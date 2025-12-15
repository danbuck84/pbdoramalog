'use server';

import { TMDBSearchResult } from '@/types/tmdb';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Server Action para buscar doramas no TMDB
 * Usa 'use server' para executar no lado do servidor (segurança)
 * A API Key nunca é exposta ao cliente
 * 
 * @param query - Termo de busca
 * @returns Resultados da busca do TMDB
 */
export async function searchDramas(query: string): Promise<TMDBSearchResult> {
    if (!TMDB_API_KEY) {
        throw new Error('TMDB_API_KEY não configurada no servidor');
    }

    if (!query.trim()) {
        return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    try {
        const url = new URL(`${TMDB_BASE_URL}/search/tv`);
        url.searchParams.set('api_key', TMDB_API_KEY);
        url.searchParams.set('query', query);
        url.searchParams.set('language', 'pt-BR');
        url.searchParams.set('include_adult', 'false');

        const response = await fetch(url.toString(), {
            // Revalidate a cada 1 hora (cache do Next.js)
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }

        const data: TMDBSearchResult = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar doramas:', error);
        throw error;
    }
}
