import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Drama } from '@/types/drama';

export interface DramaWithFirestoreId extends Drama {
    firestoreId: string; // ID do documento no Firestore
}

/**
 * Hook para buscar e escutar mudanças em tempo real dos doramas no Firestore
 * Usa onSnapshot para atualização automática quando dados mudam
 */
export function useDramas() {
    const [dramas, setDramas] = useState<DramaWithFirestoreId[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Query para buscar todos os doramas, ordenados por data de criação
        const q = query(
            collection(db, 'dramas'),
            orderBy('createdAt', 'desc')
        );

        // Listener em tempo real
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const dramasData: DramaWithFirestoreId[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                    ...(doc.data() as Omit<Drama, 'id'>),
                    id: doc.data().id || doc.id,
                    firestoreId: doc.id, // ID do documento no Firestore
                }));

                setDramas(dramasData);
                setIsLoading(false);
            },
            (err) => {
                console.error('Erro ao buscar doramas:', err);
                setError(err as Error);
                setIsLoading(false);
            }
        );

        // Cleanup: desinscreve o listener quando o componente desmonta
        return () => unsubscribe();
    }, []);

    return { dramas, isLoading, error };
}
