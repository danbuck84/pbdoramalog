'use client';

import { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { searchTVShows, getTMDBImageUrl } from '@/lib/tmdb';
import { TMDBShow } from '@/types/tmdb';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectShow?: (show: TMDBShow) => void;
}

/**
 * Dialog de busca de doramas com design Glassmorphism
 * - Campo de busca com debounce (500ms)
 * - Resultados como cards verticais (estilo poster)
 * - Background blur e transparência
 */
export function SearchDialog({ open, onOpenChange, onSelectShow }: SearchDialogProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<TMDBShow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce da busca (espera 500ms após parar de digitar)
    const debouncedQuery = useDebounce(query, 500);

    // Efeito para buscar quando o query debounced muda
    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await searchTVShows(searchQuery);
            setResults(data.results);
        } catch (err) {
            console.error('Erro na busca:', err);
            setError('Erro ao buscar doramas. Verifique a configuração da API Key.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Executa busca quando debouncedQuery muda
    useEffect(() => {
        handleSearch(debouncedQuery);
    }, [debouncedQuery, handleSearch]);

    const handleSelectShow = (show: TMDBShow) => {
        onSelectShow?.(show);
        onOpenChange(false);
        setQuery('');
        setResults([]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto backdrop-blur-xl bg-white/90 dark:bg-black/80 border-2 border-white/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        Buscar Dorama
                    </DialogTitle>
                </DialogHeader>

                {/* Campo de busca */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Digite o nome do dorama (ex: Crash Landing on You)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 h-12 text-lg backdrop-blur-sm bg-white/50 dark:bg-black/30 border-2 border-primary/20 focus:border-primary"
                        autoFocus
                    />
                    {isLoading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
                    )}
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                        {error}
                    </div>
                )}

                {/* Resultados da busca */}
                <div className="mt-6">
                    {results.length > 0 ? (
                        <>
                            <p className="text-sm text-muted-foreground mb-4">
                                {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {results.map((show) => (
                                    <button
                                        key={show.id}
                                        onClick={() => handleSelectShow(show)}
                                        className="group relative overflow-hidden rounded-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {/* Poster */}
                                        <div className="relative aspect-[2/3] w-full bg-muted">
                                            {show.poster_path ? (
                                                <Image
                                                    src={getTMDBImageUrl(show.poster_path, 'w500')}
                                                    alt={show.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    Sem poster
                                                </div>
                                            )}

                                            {/* Overlay com glassmorphism */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Info */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-md border-t border-white/10">
                                            <h3 className="font-semibold text-sm text-white line-clamp-2 mb-1">
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
                                    </button>
                                ))}
                            </div>
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
            </DialogContent>
        </Dialog>
    );
}
