import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Drama } from '@/types/drama';

/**
 * Hook para buscar um drama específico do Firestore em tempo real
 * @param firestoreId - ID do documento no Firestore
 */
export function useDrama(firestoreId: string) {
    const [drama, setDrama] = useState<Drama | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!firestoreId) {
            setIsLoading(false);
            return;
        }

        const dramaRef = doc(db, 'dramas', firestoreId);

        // Listener em tempo real
        const unsubscribe = onSnapshot(
            dramaRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setDrama({
                        ...(docSnap.data() as Omit<Drama, 'id'>),
                        id: docSnap.data().id || docSnap.id,
                    });
                } else {
                    setError(new Error('Drama não encontrado'));
                }
                setIsLoading(false);
            },
            (err) => {
                console.error('Erro ao buscar drama:', err);
                setError(err as Error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [firestoreId]);

    return { drama, isLoading, error };
}
