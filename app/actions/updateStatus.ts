'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

/**
 * Server Action para atualizar status do drama
 * Permite mover entre watchlist -> watching -> completed
 * Smart Complete: Ao marcar como completed, auto-completa episódios
 */
export async function updateDramaStatus(
    firestoreId: string,
    newStatus: 'watchlist' | 'watching' | 'completed',
    chosenBy?: 'Dan' | 'Carol'
) {
    try {
        const dramaRef = doc(db, 'dramas', firestoreId);
        const updates: any = {
            status: newStatus,
        };

        // Se mudar para watching, chosenBy é obrigatório
        if (newStatus === 'watching' && chosenBy) {
            updates.chosenBy = chosenBy;
        }

        // Smart Complete: Se marcar como completed, força 100% dos episódios
        if (newStatus === 'completed') {
            const dramaSnap = await getDoc(dramaRef);
            if (dramaSnap.exists()) {
                const dramaData = dramaSnap.data();
                updates.watchedEpisodes = dramaData.totalEpisodes || 0;
                console.log(`[SERVER] Smart Complete: Setando watchedEpisodes para ${dramaData.totalEpisodes}`);
            }
        }

        await updateDoc(dramaRef, updates);

        console.log(`[SERVER] Status atualizado para ${newStatus}`);
        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw new Error('Falha ao atualizar status.');
    }
}
