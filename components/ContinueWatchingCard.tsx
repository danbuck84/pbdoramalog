import { Drama } from '@/types/drama';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
    const indicatorClass = drama.chosenBy === 'Dan'
        ? 'bg-gradient-to-r from-primary to-cyan-400' // Azul Dan → Ciano
        : 'bg-gradient-to-r from-secondary to-accent'; // Rosa Carol → Roxo Neon

    const cardContent = (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="relative aspect-[2/3] w-full">
                <Image
                    src={`https://image.tmdb.org/t/p/w500${drama.poster_path}`}
                    alt={drama.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                />
            </div>

            <CardContent className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{drama.title}</h3>
                    <p className="text-sm text-muted-foreground">
                        Ep {drama.watchedEpisodes} de {drama.totalEpisodes}
                    </p>
                </div>

                {/* Barra de progresso com cor dinâmica */}
                <div className="space-y-2">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={`h-full transition-all ${indicatorClass}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className={drama.chosenBy === 'Dan' ? 'text-primary font-medium' : 'text-secondary font-medium'}>
                            Escolhido por {drama.chosenBy}
                        </span>
                        <span className="text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
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
