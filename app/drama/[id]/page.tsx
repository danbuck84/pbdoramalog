'use client';

import { Drama } from '@/types/drama';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface DramaDetailsProps {
    drama: Drama;
}

/**
 * Página de Detalhes com design "Dark Cinema"
 * Features:
 * - Background escuro (#0a0a0a)
 * - Split Rating System: Nota Média (grande) + Notas Individuais (pequenas com avatar)
 * - Layout imersivo estilo cinema
 */
export default function DramaDetails({ drama }: DramaDetailsProps) {
    // Calcula nota média
    const averageRating = ((drama.ratings.dan + drama.ratings.carol) / 2).toFixed(1);
    const progress = (drama.watchedEpisodes / drama.totalEpisodes) * 100;

    // Função para renderizar estrelas
    const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
        const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClass} ${star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-muted text-muted'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background-dark dark text-white">
            {/* Header com backdrop do poster */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                {/* Backdrop image */}
                <div className="absolute inset-0">
                    <Image
                        src={`https://image.tmdb.org/t/p/original${drama.poster_path}`}
                        alt={drama.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient overlay para legibilidade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent" />
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                    <h1 className="text-4xl font-bold">{drama.title}</h1>

                    {/* Badges de status */}
                    <div className="flex gap-2">
                        <Badge
                            variant="outline"
                            className={`${drama.chosenBy === 'Dan'
                                    ? 'border-primary text-primary'
                                    : 'border-secondary text-secondary'
                                }`}
                        >
                            Escolhido por {drama.chosenBy}
                        </Badge>
                        <Badge variant="secondary">
                            {drama.status === 'watching' && 'Assistindo'}
                            {drama.status === 'completed' && 'Completo'}
                            {drama.status === 'watchlist' && 'Lista'}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container max-w-4xl mx-auto px-6 py-8 space-y-8">

                {/* Split Rating System */}
                <Card className="bg-card-dark border-border">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Nota Média (Destaque) */}
                            <div className="md:col-span-3 flex flex-col items-center justify-center py-6 border-b border-border">
                                <p className="text-sm text-muted-foreground mb-2">Nota Média</p>
                                <div className="text-6xl font-bold text-white mb-3">
                                    {averageRating}
                                </div>
                                {renderStars(Math.round(parseFloat(averageRating)), 'lg')}
                            </div>

                            {/* Nota Dan */}
                            <div className="flex flex-col items-center space-y-3 p-4">
                                <Avatar className="w-16 h-16 border-2 border-primary">
                                    <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
                                        D
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center space-y-1">
                                    <p className="text-sm text-muted-foreground">Dan</p>
                                    <p className="text-2xl font-bold">{drama.ratings.dan.toFixed(1)}</p>
                                    {renderStars(drama.ratings.dan)}
                                </div>
                            </div>

                            {/* Separator vertical (desktop) */}
                            <Separator orientation="vertical" className="hidden md:block justify-self-center h-full" />

                            {/* Nota Carol */}
                            <div className="flex flex-col items-center space-y-3 p-4">
                                <Avatar className="w-16 h-16 border-2 border-secondary">
                                    <AvatarFallback className="bg-secondary/20 text-secondary text-lg font-semibold">
                                        C
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center space-y-1">
                                    <p className="text-sm text-muted-foreground">Carol</p>
                                    <p className="text-2xl font-bold">{drama.ratings.carol.toFixed(1)}</p>
                                    {renderStars(drama.ratings.carol)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progresso */}
                <Card className="bg-card-dark border-border">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Progresso</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Episódio {drama.watchedEpisodes} de {drama.totalEpisodes}
                                </span>
                                <span className="font-medium">{Math.round(progress)}%</span>
                            </div>
                            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full transition-all ${drama.chosenBy === 'Dan'
                                            ? 'bg-gradient-to-r from-primary to-cyan-400'
                                            : 'bg-gradient-to-r from-secondary to-accent'
                                        }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
