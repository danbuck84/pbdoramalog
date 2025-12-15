'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getTVShowDetails } from '@/lib/tmdb';

/**
 * Tipo de entrada para adicionar um drama
 */
export interface DramaInput {
    tmdbId: number;
    title: string;
    posterPath: string;
    chosenBy?: 'Dan' | 'Carol'; // Opcional para watchlist
    status: 'watchlist' | 'watching';
}

/**
 * Server Action para adicionar um drama ao Firestore
 * Busca detalhes completos do TMDB e salva na coleção 'dramas'
 */
export async function addDrama(data: DramaInput) {
    console.log('[SERVER] addDrama iniciado com dados:', {
        tmdbId: data.tmdbId,
        title: data.title,
        chosenBy: data.chosenBy || 'none',
        status: data.status
    });

    try {
        // Busca detalhes completos do TMDB (incluindo número de episódios)
        console.log('[SERVER] Buscando detalhes do TMDB para ID:', data.tmdbId);
        const details = await getTVShowDetails(data.tmdbId);
        console.log('[SERVER] Detalhes obtidos:', {
            name: details.name,
            episodes: details.number_of_episodes
        });

        // Prepara o documento para salvar
        const dramaDoc: any = {
            id: data.tmdbId.toString(),
            title: data.title,
            poster_path: data.posterPath,
            status: data.status,
            ratings: {
                dan: 0,
                carol: 0,
            },
            totalEpisodes: details.number_of_episodes || 0,
            watchedEpisodes: 0,
            createdAt: serverTimestamp(),
        };

        // chosenBy é opcional para watchlist
        if (data.chosenBy) {
            dramaDoc.chosenBy = data.chosenBy;
        }

        console.log('[SERVER] Salvando no Firestore...');
        // Salva no Firestore
        const docRef = await addDoc(collection(db, 'dramas'), dramaDoc);
        console.log('[SERVER] Salvo com sucesso! Doc ID:', docRef.id);

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('[SERVER] ERRO DETALHADO ao adicionar drama:');
        console.error('[SERVER] Tipo do erro:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[SERVER] Mensagem:', error instanceof Error ? error.message : String(error));
        console.error('[SERVER] Stack:', error instanceof Error ? error.stack : 'N/A');
        console.error('[SERVER] Dados recebidos:', data);
        throw new Error('Falha ao adicionar drama. Tente novamente.');
    }
}

/**
 * Server Action para atualizar progresso de episódios
 * Auto-completa o drama quando atingir 100%
 */
export async function updateDramaProgress(firestoreId: string, watchedEpisodes: number) {
    try {
        const dramaRef = doc(db, 'dramas', firestoreId);

        // Busca o drama atual para verificar totalEpisodes
        const dramaSnap = await getDoc(dramaRef);
        if (!dramaSnap.exists()) {
            throw new Error('Drama não encontrado');
        }

        const dramaData: any = dramaSnap.data();
        const updates: any = {
            watchedEpisodes,
        };

        // Auto-complete: Se assistiu todos os episódios, marcar como completed
        if (watchedEpisodes >= dramaData.totalEpisodes && dramaData.totalEpisodes > 0) {
            updates.status = 'completed';
            console.log('[SERVER] Auto-completando drama (100% assistido)');
        }

        await updateDoc(dramaRef, updates);

        return { success: true, autoCompleted: updates.status === 'completed' };
    } catch (error) {
        console.error('Erro ao atualizar progresso:', error);
        throw new Error('Falha ao atualizar progresso.');
    }
}

/**
 * Server Action para atualizar rating de um usuário
 */
export async function updateDramaRating(
    firestoreId: string,
    user: 'dan' | 'carol',
    rating: number
) {
    try {
        const dramaRef = doc(db, 'dramas', firestoreId);
        await updateDoc(dramaRef, {
            [`ratings.${user}`]: rating,
        });

        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar rating:', error);
        throw new Error('Falha ao atualizar rating.');
    }
}

/**
 * Server Action para deletar um drama
 */
export async function deleteDrama(firestoreId: string) {
    try {
        const dramaRef = doc(db, 'dramas', firestoreId);
        await deleteDoc(dramaRef);

        return { success: true };
    } catch (error) {
        console.error('Erro ao deletar drama:', error);
        throw new Error('Falha ao deletar drama.');
    }
}
