'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * Server Action para atualizar status do drama
 * Permite mover entre watchlist -> watching -> completed
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

        await updateDoc(dramaRef, updates);

        console.log(`[SERVER] Status atualizado para ${newStatus}`);
        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw new Error('Falha ao atualizar status.');
    }
}
