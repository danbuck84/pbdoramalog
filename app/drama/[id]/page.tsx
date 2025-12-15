'use client';

import { use } from 'react';
import { useDrama } from '@/hooks/useDrama';
import { updateDramaProgress, updateDramaRating, deleteDrama } from '@/app/actions/dramas';
import { updateDramaStatus } from '@/app/actions/updateStatus';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Heart, Trash2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * Página de detalhes do dorama com estética K-Pop vibrante
 * - Glassmorphism e gradientes
 * - Edição de ratings com corações
 * - Controle de progresso fluido
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

    // Marca como concluído manualmente
    const handleMarkAsCompleted = async () => {
        if (!confirm('Marcar este dorama como concluído?')) return;

        setIsUpdating(true);
        try {
            await updateDramaStatus(firestoreId, 'completed');
            toast.success('Dorama marcado como concluído! 🎉');
        } catch (error) {
            toast.error('Erro ao atualizar status');
        } finally {
            setIsUpdating(false);
        }
    };

    // Renderiza corações (K-Pop style)
    const renderHearts = (currentRating: number, onRate: (rating: number) => void, color: string) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((heart) => (
                    <button
                        key={heart}
                        onClick={() => onRate(heart)}
                        disabled={isUpdating}
                        className="transition-all hover:scale-125 disabled:opacity-50 active:scale-95"
                    >
                        <Heart
                            className={`w-7 h-7 ${heart <= currentRating
                                ? `fill-${color} text-${color}`
                                : 'fill-gray-800/30 text-gray-600/50'
                                }`}
                            style={{
                                fill: heart <= currentRating ? color : 'rgba(55, 65, 81, 0.3)',
                                color: heart <= currentRating ? color : 'rgba(75, 85, 99, 0.5)'
                            }}
                        />
                    </button>
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
            </div>
        );
    }

    if (!drama) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 flex flex-col items-center justify-center gap-4">
                <p className="text-white text-xl">Dorama não encontrado</p>
                <Link href="/">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90">
                        Voltar para Home
                    </Button>
                </Link>
            </div>
        );
    }

    const progress = (drama.watchedEpisodes / drama.totalEpisodes) * 100;
    const averageRating = ((drama.ratings.dan + drama.ratings.carol) / 2).toFixed(1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 text-white relative overflow-hidden">
            {/* Background Decorative Gradients */}
            <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-cyan-400/20 blur-3xl" />
            <div className="absolute top-40 right-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />

            {/* Hero Section com backdrop */}
            <div className="relative h-[55vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={`https://image.tmdb.org/t/p/original${drama.poster_path}`}
                        alt={drama.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Gradient Fadeout Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-background" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 z-10">
                    {/* Status Pill */}
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                        {drama.status === 'watching' && '▶️ Assistindo'}
                        {drama.status === 'completed' && '✓ Completo'}
                        {drama.status === 'watchlist' && '📋 Quero Ver'}
                    </span>

                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                        {drama.title}
                    </h1>

                    {/* Pill "Escolhido por" - só exibe se chosenBy estiver definido */}
                    {drama.chosenBy && (
                        <div className="flex gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md border ${drama.chosenBy === 'Dan'
                                    ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
                                    : 'bg-pink-500/20 border-pink-400/30 text-pink-300'
                                }`}>
                                {drama.chosenBy === 'Dan' ? '💙 Escolhido por Dan' : '💗 Escolhido por Carol'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Botão Voltar (Glassmorphism) */}
            <Link href="/" className="absolute top-6 left-6 z-10">
                <button className="flex items-center justify-center size-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition">
                    <ArrowLeft className="h-5 w-5" />
                </button>
            </Link>

            {/* Main Content */}
            <div className="relative z-10 px-4 md:px-6 pb-24 -mt-20 max-w-4xl mx-auto">
                {/* Glassmorphism Card - Rating System */}
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl mb-6">
                    {/* Nota Média - Destaque central */}
                    <div className="flex flex-col items-center justify-center pb-6 mb-6 border-b border-white/10">
                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Nota Média</p>
                        <div className="flex items-center gap-4">
                            <div className="text-6xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                {averageRating}
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((heart) => (
                                    <Heart
                                        key={heart}
                                        className={`w-6 h-6 ${heart <= Math.round(parseFloat(averageRating))
                                            ? 'fill-pink-500 text-pink-500'
                                            : 'fill-gray-700 text-gray-700'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ratings individuais - Dan e Carol */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dan */}
                        <div className="flex flex-col items-center space-y-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-400/20">
                            {/* Avatar com anel gradiente */}
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 blur-sm" />
                                <div className="relative flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 border-2 border-blue-300/50">
                                    <span className="text-2xl font-black text-white">D</span>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-sm text-blue-300 font-semibold">Dan</p>
                                <p className="text-3xl font-bold text-white">{drama.ratings.dan.toFixed(1)}</p>
                                {renderHearts(drama.ratings.dan, (rating) => handleUpdateRating('dan', rating), '#3b82f6')}
                            </div>
                        </div>

                        {/* Carol */}
                        <div className="flex flex-col items-center space-y-4 p-4 rounded-2xl bg-pink-500/10 border border-pink-400/20">
                            {/* Avatar com anel gradiente */}
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 blur-sm" />
                                <div className="relative flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border-2 border-pink-300/50">
                                    <span className="text-2xl font-black text-white">C</span>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-sm text-pink-300 font-semibold">Carol</p>
                                <p className="text-3xl font-bold text-white">{drama.ratings.carol.toFixed(1)}</p>
                                {renderHearts(drama.ratings.carol, (rating) => handleUpdateRating('carol', rating), '#ec4899')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glassmorphism Card - Progresso */}
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl mb-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-2xl">📺</span>
                        Progresso
                    </h3>

                    <div className="space-y-6">
                        {/* Info e Percentual */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">
                                Episódio {drama.watchedEpisodes} de {drama.totalEpisodes}
                            </span>
                            <span className="font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                {Math.round(progress)}%
                            </span>
                        </div>

                        {/* Barra de Progresso Fluida */}
                        <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                                className={`h-full transition-all duration-500 ease-out rounded-full ${(drama.chosenBy || 'Dan') === 'Dan'
                                    ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500'
                                    : 'bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500'
                                    } shadow-lg`}
                                style={{
                                    width: `${progress}%`,
                                    boxShadow: (drama.chosenBy || 'Dan') === 'Dan'
                                        ? '0 0 20px rgba(59, 130, 246, 0.5)'
                                        : '0 0 20px rgba(236, 72, 153, 0.5)'
                                }}
                            />
                        </div>

                        {/* Controles */}
                        <div className="flex items-center justify-center gap-6">
                            <button
                                onClick={() => handleUpdateProgress(-1)}
                                disabled={isUpdating || drama.watchedEpisodes === 0}
                                className="flex items-center justify-center size-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all disabled:opacity-30 active:scale-95"
                            >
                                <Minus className="h-5 w-5" />
                            </button>

                            <div className="text-center min-w-[100px]">
                                <p className="text-4xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    {drama.watchedEpisodes}
                                </p>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">episódios</p>
                            </div>

                            <button
                                onClick={() => handleUpdateProgress(1)}
                                disabled={isUpdating || drama.watchedEpisodes === drama.totalEpisodes}
                                className="flex items-center justify-center size-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white transition-all disabled:opacity-30 active:scale-95 shadow-lg"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ações Finais */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {/* Marcar como Concluído - apenas se não estiver completed */}
                    {drama.status !== 'completed' && (
                        <button
                            onClick={handleMarkAsCompleted}
                            disabled={isUpdating}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 font-bold transition-all disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-5 w-5" />
                            Marcar como Concluído
                        </button>
                    )}

                    {/* Excluir */}
                    <button
                        onClick={handleDelete}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold transition-all disabled:opacity-50"
                    >
                        <Trash2 className="h-5 w-5" />
                        Excluir Dorama
                    </button>
                </div>
            </div>
        </div>
    );
}
