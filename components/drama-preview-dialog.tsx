'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TMDBShowDetails } from '@/types/tmdb';
import { Star, Calendar, Tv, Clock, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface DramaPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    details: TMDBShowDetails | null;
    isLoading: boolean;
    onAddToList: () => void;
}

/**
 * Dialog de preview do dorama com detalhes completos do TMDB
 * Mostra: Sinopse, Gêneros, Elenco, Nota, Ano, Episódios, Duração
 * Ação: Botão "Adicionar à Lista" que abre o AddDramaDialog
 */
export function DramaPreviewDialog({ open, onOpenChange, details, isLoading, onAddToList }: DramaPreviewDialogProps) {
    if (!details && !isLoading) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-lg max-h-[85vh] overflow-y-auto overflow-x-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : details ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{details.name}</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Detalhes completos do dorama antes de adicionar à lista
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Header com Poster e Info Básica */}
                            <div className="flex gap-4">
                                {/* Poster */}
                                <div className="relative w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                                    {details.poster_path ? (
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
                                            alt={details.name}
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                            Sem poster
                                        </div>
                                    )}
                                </div>

                                {/* Info Rápida */}
                                <div className="flex-1 space-y-3">
                                    {/* Nota TMDB */}
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-2xl font-bold">{details.vote_average.toFixed(1)}</span>
                                        <span className="text-sm text-muted-foreground">({details.vote_count.toLocaleString()} votos)</span>
                                    </div>

                                    {/* Meta info */}
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        {details.first_air_date && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(details.first_air_date).getFullYear()}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Tv className="h-4 w-4" />
                                            <span>{details.number_of_episodes} eps</span>
                                        </div>
                                        {details.episode_run_time?.[0] && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{details.episode_run_time[0]} min/ep</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Gêneros */}
                                    <div className="flex flex-wrap gap-2">
                                        {details.genres?.slice(0, 4).map((genre) => (
                                            <Badge key={genre.id} variant="secondary" className="text-xs">
                                                {genre.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sinopse */}
                            {details.overview && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Sinopse</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-normal">
                                        {details.overview}
                                    </p>
                                </div>
                            )}

                            {/* Elenco (se disponível) */}
                            {details.credits?.cast && details.credits.cast.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Elenco Principal</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {details.credits.cast.slice(0, 6).map((actor) => (
                                            <div key={actor.id} className="flex flex-col items-center min-w-[80px]">
                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted mb-2">
                                                    {actor.profile_path ? (
                                                        <Image
                                                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                                            alt={actor.name}
                                                            width={64}
                                                            height={64}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                            {actor.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs font-semibold text-center leading-tight line-clamp-2">
                                                    {actor.name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground text-center line-clamp-1">
                                                    {actor.character}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                onClick={onAddToList}
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                size="lg"
                            >
                                Adicionar à Lista
                            </Button>
                        </DialogFooter>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
