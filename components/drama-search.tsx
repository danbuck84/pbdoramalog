'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddDramaDialog } from '@/components/add-drama-dialog';
import { DramaPreviewDialog } from '@/components/drama-preview-dialog';
import { TMDBShow, TMDBShowDetails } from '@/types/tmdb';
import { getTVShowDetails } from '@/lib/tmdb';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';

// HARDCODED API KEY - Client-side fetch para bypass de Server Actions
const API_KEY = "cc8d2bb815d2b5cc0a96106925aa7ab8";
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Componente de busca com preview
 * Fluxo: Busca -> Click -> Preview com detalhes -> Add
 */
export function DramaSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<TMDBShow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Preview Dialog
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState<TMDBShow | null>(null);
    const [showDetails, setShowDetails] = useState<TMDBShowDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    // Add Dialog
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const debouncedQuery = useDebounce(query, 500);

    // Busca automática (CLIENT-SIDE)
    useEffect(() => {
        async function performSearch() {
            if (!debouncedQuery.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const url = new URL(`${TMDB_BASE_URL}/search/tv`);
                url.searchParams.set('api_key', API_KEY);
                url.searchParams.set('query', debouncedQuery);
                url.searchParams.set('language', 'pt-BR');
                url.searchParams.set('include_adult', 'false');

                console.log('[CLIENT] Fazendo busca TMDB...', debouncedQuery);

                const response = await fetch(url.toString());

                if (!response.ok) {
                    console.error('[CLIENT] Erro HTTP:', response.status);
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log('[CLIENT] Resultados:', data.results?.length || 0);
                setResults(data.results || []);
            } catch (err) {
                console.error('[CLIENT] Erro na busca:', err);
                setError('Erro ao buscar doramas. Tente novamente.');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }

        performSearch();
    }, [debouncedQuery]);

    // Abre preview e busca detalhes
    const handleShowClick = async (show: TMDBShow) => {
        setSelectedShow(show);
        setPreviewOpen(true);
        setIsLoadingDetails(true);
        setShowDetails(null);

        try {
            const details = await getTVShowDetails(show.id);
            setShowDetails(details);
        } catch (err) {
            console.error('Erro ao buscar detalhes:', err);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    // Do preview para add
    const handleAddFromPreview = () => {
        setPreviewOpen(false);
        setAddDialogOpen(true);
    };

    // Sucesso no add
    const handleSuccess = () => {
        setQuery('');
        setResults([]);
        setSelectedShow(null);
        setShowDetails(null);
    };

    return (
        <>
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
                                <Card
                                    key={show.id}
                                    onClick={() => handleShowClick(show)}
                                    className="p-3 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
                                >
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
                                        <div className="flex-1 min-w-0">
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

            {/* Preview Dialog */}
            <DramaPreviewDialog
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                details={showDetails}
                isLoading={isLoadingDetails}
                onAddToList={handleAddFromPreview}
            />

            {/* Add Dialog */}
            <AddDramaDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                show={selectedShow}
                onSuccess={handleSuccess}
            />
        </>
    );
}
