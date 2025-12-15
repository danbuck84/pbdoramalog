'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getTVShowDetails } from '@/lib/tmdb';

/**
 * Tipo de entrada para adicionar um drama
 */
export interface DramaInput {
    tmdbId: number;
    title: string;
    posterPath: string;
    chosenBy: 'Dan' | 'Carol';
    status: 'watchlist' | 'watching';
}

/**
 * Server Action para adicionar um drama ao Firestore
 * Busca detalhes completos do TMDB e salva na coleção 'dramas'
 */
export async function addDrama(data: DramaInput) {
    try {
        // Busca detalhes completos do TMDB (incluindo número de episódios)
        const details = await getTVShowDetails(data.tmdbId);

        // Prepara o documento para salvar
        const dramaDoc = {
            id: data.tmdbId.toString(),
            title: data.title,
            poster_path: data.posterPath,
            status: data.status,
            chosenBy: data.chosenBy,
            ratings: {
                dan: 0,
                carol: 0,
            },
            totalEpisodes: details.number_of_episodes || 0,
            watchedEpisodes: 0,
            createdAt: serverTimestamp(),
        };

        // Salva no Firestore
        const docRef = await addDoc(collection(db, 'dramas'), dramaDoc);

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Erro ao adicionar drama:', error);
        throw new Error('Falha ao adicionar drama. Tente novamente.');
    }
}
