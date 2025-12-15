'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Drama } from '@/types/drama';
import { Tv, Clock, Star } from 'lucide-react';

interface DramaStatsProps {
    dramas: Drama[];
}

/**
 * Card de estatísticas com gráfico visual
 * Mostra: Total assistindo, concluídos, episódios vistos e horas totais
 */
export function DramaStats({ dramas }: DramaStatsProps) {
    // Calcular estatísticas
    const watching = dramas.filter(d => d.status === 'watching').length;
    const completed = dramas.filter(d => d.status === 'completed').length;
    const watchlist = dramas.filter(d => d.status === 'watchlist').length;
    const total = dramas.length;

    const totalEpisodesWatched = dramas.reduce((sum, d) => sum + d.watchedEpisodes, 0);

    // Estimar horas (assumindo 60min por episódio em média)
    const totalHours = Math.round(totalEpisodesWatched * 60 / 60);

    // Percentuais para gráfico de rosca
    const watchingPercent = total > 0 ? (watching / total) * 100 : 0;
    const completedPercent = total > 0 ? (completed / total) * 100 : 0;
    const watchlistPercent = total > 0 ? (watchlist / total) * 100 : 0;

    return (
        <Card className="bg-gradient-to-br from-white to-purple-50/30 border-purple-200/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    My Drama Stats ✨
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gráfico de Rosca (CSS Puro) */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-40 h-40">
                            {/* Background circle */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-200" />

                            {/* Rosca com gradiente cônico */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: `conic-gradient(
                                        from 0deg,
                                        #3b82f6 0deg ${watchingPercent * 3.6}deg,
                                        #ec4899 ${watchingPercent * 3.6}deg ${(watchingPercent + completedPercent) * 3.6}deg,
                                        #a855f7 ${(watchingPercent + completedPercent) * 3.6}deg ${(watchingPercent + completedPercent + watchlistPercent) * 3.6}deg,
                                        #e5e7eb ${(watchingPercent + completedPercent + watchlistPercent) * 3.6}deg 360deg
                                    )`,
                                }}
                            />

                            {/* Centro branco (furo da rosca) */}
                            <div className="absolute inset-8 rounded-full bg-white flex items-center justify-center shadow-inner">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-purple-600">{total}</p>
                                    <p className="text-xs text-muted-foreground">Doramas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Detalhadas */}
                    <div className="space-y-4">
                        {/* Assistindo */}
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Assistindo</p>
                                <p className="text-2xl font-bold text-blue-600">{watching}</p>
                            </div>
                        </div>

                        {/* Concluídos */}
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-pink-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Concluídos</p>
                                <p className="text-2xl font-bold text-pink-600">{completed}</p>
                            </div>
                        </div>

                        {/* Quero Ver */}
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Quero Ver</p>
                                <p className="text-2xl font-bold text-purple-600">{watchlist}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Métricas Adicionais */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50">
                        <Tv className="h-8 w-8 text-blue-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Episódios Vistos</p>
                            <p className="text-xl font-bold text-blue-600">{totalEpisodesWatched}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50">
                        <Clock className="h-8 w-8 text-pink-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Horas Totais</p>
                            <p className="text-xl font-bold text-pink-600">{totalHours}h</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
