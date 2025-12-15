'use client';

import { use } from 'react';
import { useDrama } from '@/hooks/useDrama';
import { updateDramaProgress, updateDramaRating, deleteDrama } from '@/app/actions/dramas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Plus, Minus, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * Página de detalhes do dorama com design Dark Cinema
 * - Edição de ratings (Dan e Carol)
 * - Controle de progresso de episódios
 * - Botão de exclusão
 */
export default function DramaDetailsPage({ params }: PageProps) {
    const { id: firestoreId } = use(params);
    const { drama, isLoading } = useDrama(firestoreId);
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    // Atualiza progresso
    const handleUpdateProgress = async (change: number) => {
        if (!drama) return;

        const newProgress = Math.max(0, Math.min(drama.totalEpisodes, drama.watchedEpisodes + change));

        setIsUpdating(true);
        try {
            await updateDramaProgress(firestoreId, newProgress);
            toast.success('Progresso atualizado!');
        } catch (error) {
            toast.error('Erro ao atualizar progresso');
        } finally {
            setIsUpdating(false);
        }
    };

    // Atualiza rating
    const handleUpdateRating = async (user: 'dan' | 'carol', rating: number) => {
        setIsUpdating(true);
        try {
            await updateDramaRating(firestoreId, user, rating);
            toast.success(`Nota de ${user === 'dan' ? 'Dan' : 'Carol'} atualizada!`);
        } catch (error) {
            toast.error('Erro ao atualizar nota');
        } finally {
            setIsUpdating(false);
        }
    };

    // Deleta drama
    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este dorama?')) return;

        setIsUpdating(true);
        try {
            await deleteDrama(firestoreId);
            toast.success('Dorama excluído com sucesso!');
            router.push('/');
        } catch (error) {
            toast.error('Erro ao excluir dorama');
            setIsUpdating(false);
        }
    };

    // Renderiza estrelas
    const renderStars = (currentRating: number, onRate: (rating: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onRate(star)}
                        disabled={isUpdating}
                        className="transition-transform hover:scale-110 disabled:opacity-50"
                    >
                        <Star
                            className={`w-8 h-8 ${star <= currentRating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-muted text-muted'
                                }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-dark dark flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!drama) {
        return (
            <div className="min-h-screen bg-background-dark dark flex flex-col items-center justify-center gap-4">
                <p className="text-white text-xl">Dorama não encontrado</p>
                <Link href="/">
                    <Button>Voltar para Home</Button>
                </Link>
            </div>
        );
    }

    const progress = (drama.watchedEpisodes / drama.totalEpisodes) * 100;
    const averageRating = ((drama.ratings.dan + drama.ratings.carol) / 2).toFixed(1);

    return (
        <div className="min-h-screen bg-background-dark dark text-white">
            {/* Header com backdrop */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={`https://image.tmdb.org/t/p/original${drama.poster_path}`}
                        alt={drama.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent" />
                </div>

                {/* Botão Voltar */}
                <Link href="/" className="absolute top-6 left-6 z-10">
                    <Button variant="outline" className="bg-black/50 border-white/20 hover:bg-black/70">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Voltar
                    </Button>
                </Link>

                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                    <h1 className="text-4xl font-bold">{drama.title}</h1>
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

            {/* Content */}
            <div className="container max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* Split Rating System */}
                <Card className="bg-card border-border">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Nota Média */}
                            <div className="md:col-span-3 flex flex-col items-center justify-center py-6 border-b border-border">
                                <p className="text-sm text-muted-foreground mb-2">Nota Média</p>
                                <div className="text-6xl font-bold mb-3">{averageRating}</div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-6 h-6 ${star <= Math.round(parseFloat(averageRating))
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-muted text-muted'
                                                }`}
                                        />
                                    ))}
                                </div>
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
                                    {renderStars(drama.ratings.dan, (rating) => handleUpdateRating('dan', rating))}
                                </div>
                            </div>

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
                                    {renderStars(drama.ratings.carol, (rating) => handleUpdateRating('carol', rating))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Controle de Progresso */}
                <Card className="bg-card border-border">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Progresso</h3>
                        <div className="space-y-4">
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

                            {/* Botões de Controle */}
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    onClick={() => handleUpdateProgress(-1)}
                                    disabled={isUpdating || drama.watchedEpisodes === 0}
                                    variant="outline"
                                    size="lg"
                                >
                                    <Minus className="h-5 w-5" />
                                </Button>
                                <div className="text-center min-w-[100px]">
                                    <p className="text-2xl font-bold">{drama.watchedEpisodes}</p>
                                    <p className="text-xs text-muted-foreground">episódios</p>
                                </div>
                                <Button
                                    onClick={() => handleUpdateProgress(1)}
                                    disabled={isUpdating || drama.watchedEpisodes === drama.totalEpisodes}
                                    variant="outline"
                                    size="lg"
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Botão Excluir */}
                <div className="flex justify-center py-4">
                    <Button
                        onClick={handleDelete}
                        disabled={isUpdating}
                        variant="destructive"
                        size="lg"
                    >
                        <Trash2 className="mr-2 h-5 w-5" />
                        Excluir Dorama
                    </Button>
                </div>
            </div>
        </div>
    );
}
