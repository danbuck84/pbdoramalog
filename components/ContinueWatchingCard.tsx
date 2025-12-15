import { Drama } from '@/types/drama';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface ContinueWatchingCardProps {
    drama: Drama;
    firestoreId?: string;
}

/**
 * Card de "Continue Assistindo" com design K-Pop vibrante
 * Feature: Barra de progresso muda de cor baseada em quem escolheu o drama
 * - Dan: Gradiente Azul/Ciano
 * - Carol: Gradiente Rosa/Roxo
 */
export function ContinueWatchingCard({ drama, firestoreId }: ContinueWatchingCardProps) {
    const progress = (drama.watchedEpisodes / drama.totalEpisodes) * 100;

    // Define a cor do gradiente baseado em quem escolheu
    // Dan: Cyan/Blue | Carol: Pink/Rose | Undefined (Watchlist): Purple
    const indicatorClass = drama.chosenBy === 'Dan'
        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
        : drama.chosenBy === 'Carol'
            ? 'bg-gradient-to-r from-pink-500 to-rose-500'
            : 'bg-gradient-to-r from-purple-500 to-violet-500'; // Watchlist/Shared

    const cardContent = (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col h-full">
            <div className="relative aspect-[2/3] w-full flex-shrink-0">
                <Image
                    src={`https://image.tmdb.org/t/p/w500${drama.poster_path}`}
                    alt={drama.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                />
            </div>

            <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1">{drama.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {drama.watchedEpisodes} / {drama.totalEpisodes} eps
                    </p>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-2">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={`h-full transition-all ${indicatorClass}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                        {Math.round(progress)}%
                    </p>
                </div>
            </CardContent>

            {/* Overlay gradiente na borda inferior do card */}
            <div className={`h-1 ${indicatorClass}`} />
        </Card>
    );

    // Se temos firestoreId, envolve com Link
    if (firestoreId) {
        return <Link href={`/drama/${firestoreId}`}>{cardContent}</Link>;
    }

    return cardContent;
}
