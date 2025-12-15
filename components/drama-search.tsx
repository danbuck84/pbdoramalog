'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { searchDramas } from '@/app/actions/tmdb';
import { TMDBShow } from '@/types/tmdb';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Loader2, Plus } from 'lucide-react';
import Image from 'next/image';

/**
 * Componente de busca de doramas usando Server Actions
 * - Debounce de 500ms para otimizar chamadas
 * - Cards verticais com poster à esquerda
 * - Botão "Adicionar" em cada resultado
 */
export function DramaSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<TMDBShow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedQuery = useDebounce(query, 500);

    // Busca automática quando o query muda
    useEffect(() => {
        async function performSearch() {
            if (!debouncedQuery.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const data = await searchDramas(debouncedQuery);
                setResults(data.results);
            } catch (err) {
                console.error('Erro na busca:', err);
                setError('Erro ao buscar doramas. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        }

        performSearch();
    }, [debouncedQuery]);

    const handleAddDrama = (show: TMDBShow) => {
        console.log('🎬 Drama selecionado para adicionar:', {
            id: show.id,
            nome: show.name,
            ano: show.first_air_date?.substring(0, 4),
            nota: show.vote_average,
        });
        // TODO: Adicionar ao Firestore na próxima fase
        alert(`Drama selecionado: ${show.name}\n\nTODO: Implementar integração com Firestore`);
    };

    return (
        <div className="space-y-4">
            {/* Campo de busca */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Digite o nome do dorama..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                    autoFocus
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
                )}
            </div>

            {/* Mensagem de erro */}
            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                </div>
            )}

            {/* Resultados */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {results.length > 0 ? (
                    <>
                        <p className="text-sm text-muted-foreground">
                            {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                        </p>
                        {results.map((show) => (
                            <Card key={show.id} className="p-3 hover:shadow-md transition-shadow">
                                <div className="flex gap-3">
                                    {/* Poster pequeno à esquerda */}
                                    <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                                        {show.poster_path ? (
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                                                alt={show.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                                Sem poster
                                            </div>
                                        )}
                                    </div>

                                    {/* Info à direita */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold line-clamp-2 mb-1">
                                                {show.name}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {show.first_air_date && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {new Date(show.first_air_date).getFullYear()}
                                                    </Badge>
                                                )}
                                                {show.vote_average > 0 && (
                                                    <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-400">
                                                        ⭐ {show.vote_average.toFixed(1)}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botão Adicionar */}
                                        <div className="mt-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleAddDrama(show)}
                                                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                            >
                                                <Plus className="mr-1 h-4 w-4" />
                                                Adicionar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </>
                ) : query.trim() && !isLoading ? (
                    <p className="text-center text-muted-foreground py-8">
                        Nenhum resultado encontrado para &quot;{query}&quot;
                    </p>
                ) : !query.trim() ? (
                    <p className="text-center text-muted-foreground py-8">
                        Digite para buscar doramas
                    </p>
                ) : null}
            </div>
        </div>
    );
}
