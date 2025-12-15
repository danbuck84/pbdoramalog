import { TMDBSearchResult, TMDBShowDetails } from '@/types/tmdb';

// HARDCODED API KEY para garantir funcionamento em produção
const API_KEY = "cc8d2bb815d2b5cc0a96106925aa7ab8";
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Serviço para integração com TMDB (The Movie Database)
 * 
 * Para obter uma API Key gratuita:
 * 1. Crie uma conta em https://www.themoviedb.org/signup
 * 2. Vá em Settings → API → Create → Developer
 * 3. Preencha o formulário e copie a API Key (v3 auth)
 * 4. Adicione no .env.local: NEXT_PUBLIC_TMDB_API_KEY="sua_chave"
 */

/**
 * Busca shows de TV (doramas, séries) por nome
 * @param query - Termo de busca (ex: "Crash Landing on You")
 * @returns Lista de resultados da busca
 */
export async function searchTVShows(query: string): Promise<TMDBSearchResult> {
    console.log('[TMDB] Usando API Key hardcoded (Length:', API_KEY.length, ')');

    if (!query.trim()) {
        return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    try {
        const url = new URL(`${TMDB_BASE_URL}/search/tv`);
        url.searchParams.set('api_key', API_KEY);
        url.searchParams.set('query', query);
        url.searchParams.set('language', 'pt-BR'); // Resultados em português
        url.searchParams.set('include_adult', 'false');

        console.log('[TMDB] Fazendo requisição para busca...');

        const response = await fetch(url.toString());

        if (!response.ok) {
            console.error('[TMDB Status]:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('[TMDB Response Body]:', errorText);

            // Não quebra a aplicação, retorna array vazio
            return { page: 1, results: [], total_pages: 0, total_results: 0 };
        }

        const data: TMDBSearchResult = await response.json();
        console.log('[TMDB] Busca bem-sucedida:', data.results.length, 'resultados encontrados');
        return data;
    } catch (error) {
        console.error('[TMDB Error]:', error);
        // Não quebra a aplicação, retorna array vazio
        return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
}

/**
 * Busca detalhes completos de um show de TV
 * @param tvId - ID do show no TMDB
 * @returns Detalhes completos do show
 */
export async function getTVShowDetails(tvId: number): Promise<TMDBShowDetails> {
    console.log('[TMDB Details] Usando API Key hardcoded (Length:', API_KEY.length, ')');

    try {
        const url = new URL(`${TMDB_BASE_URL}/tv/${tvId}`);
        url.searchParams.set('api_key', API_KEY);
        url.searchParams.set('language', 'pt-BR');

        console.log('[TMDB Details] Buscando detalhes do show ID:', tvId);

        const response = await fetch(url.toString());

        if (!response.ok) {
            console.error('[TMDB Details Status]:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('[TMDB Details Response Body]:', errorText);
            throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }

        const data: TMDBShowDetails = await response.json();
        console.log('[TMDB Details] Detalhes obtidos com sucesso:', data.name);
        return data;
    } catch (error) {
        console.error('[TMDB Details Error]:', error);
        throw error;
    }
}

/**
 * Gera URL completa para imagem do TMDB
 * @param path - Caminho da imagem (ex: "/abc123.jpg")
 * @param size - Tamanho da imagem (w200, w500, original)
 * @returns URL completa da imagem
 */
export function getTMDBImageUrl(
    path: string | null,
    size: 'w200' | 'w500' | 'original' = 'w500'
): string {
    if (!path) {
        return '/placeholder-poster.png'; // Fallback para poster padrão
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
}
