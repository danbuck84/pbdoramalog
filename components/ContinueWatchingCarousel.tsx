'use client';

import { Drama } from '@/types/drama';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface ContinueWatchingCarouselProps {
    dramas: Drama[];
}

/**
 * Carrossel horizontal para doramas em andamento
 * Cards em formato paisagem com backdrop image
 */
export function ContinueWatchingCarousel({ dramas }: ContinueWatchingCarouselProps) {
    if (dramas.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <Play className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                    Nenhum dorama em andamento
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    Adicione um dorama para começar a assistir!
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Carrossel com scroll horizontal */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {dramas.map((drama) => {
                    const progress = (drama.watchedEpisodes / drama.totalEpisodes) * 100;

                    // Define cor baseada em quem escolheu
                    const progressColor = drama.chosenBy === 'Dan'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : drama.chosenBy === 'Carol'
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                            : 'bg-gradient-to-r from-purple-500 to-violet-500';

                    return (
                        <Link
                            key={drama.id}
                            href={`/drama/${drama.firestoreId}`}
                            className="flex-shrink-0 w-80 snap-start group"
                        >
                            <div className="relative h-44 rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                                {/* Backdrop Image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w780${drama.poster_path}`}
                                        alt={drama.title}
                                        fill
                                        className="object-cover"
                                        sizes="320px"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                                    {/* Título */}
                                    <h3 className="text-white font-bold text-lg line-clamp-1 drop-shadow-lg">
                                        {drama.title}
                                    </h3>

                                    {/* Badge de episódio */}
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                                            Ep {drama.watchedEpisodes}/{drama.totalEpisodes}
                                        </span>
                                        <span className="text-white/80 text-xs">
                                            {Math.round(progress)}%
                                        </span>
                                    </div>

                                    {/* Barra de progresso */}
                                    <div className="relative h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${progressColor} transition-all duration-300`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Play icon overlay on hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                        <Play className="h-8 w-8 text-white fill-white" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
