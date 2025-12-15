'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { addDrama } from '@/app/actions/dramas';
import { TMDBShow } from '@/types/tmdb';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface AddDramaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    show: TMDBShow | null;
    onSuccess?: () => void;
}

/**
 * Dialog para adicionar um drama ao banco de dados
 * - Se watching: escolhe Dan/Carol (obrigatório)
 * - Se watchlist: "Quem Escolheu" não aparece
 */
export function AddDramaDialog({ open, onOpenChange, show, onSuccess }: AddDramaDialogProps) {
    const [chosenBy, setChosenBy] = useState<'Dan' | 'Carol'>('Dan');
    const [status, setStatus] = useState<'watchlist' | 'watching'>('watchlist');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!show) return;

        setIsLoading(true);

        try {
            await addDrama({
                tmdbId: show.id,
                title: show.name,
                posterPath: show.poster_path || '',
                chosenBy: status === 'watching' ? chosenBy : undefined, // Só envia se watching
                status,
            });

            toast.success('Dorama adicionado com sucesso! 🎉');
            onOpenChange(false);
            onSuccess?.();

            // Reset form
            setChosenBy('Dan');
            setStatus('watchlist');
        } catch (error) {
            console.error('Erro ao adicionar:', error);
            toast.error('Erro ao adicionar dorama. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!show) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Adicionar Dorama</DialogTitle>
                    <DialogDescription className="sr-only">
                        Preencha os dados abaixo para adicionar um novo dorama à sua lista
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Preview do Dorama */}
                    <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/50">
                        <div className="relative w-20 h-30 flex-shrink-0 rounded overflow-hidden bg-muted">
                            {show.poster_path ? (
                                <Image
                                    src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                                    alt={show.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                    Sem poster
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold line-clamp-2">{show.name}</h3>
                            {show.first_air_date && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {new Date(show.first_air_date).getFullYear()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status Inicial */}
                    <div className="space-y-3">
                        <Label htmlFor="status" className="text-base font-semibold">
                            Como deseja adicionar?
                        </Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as 'watchlist' | 'watching')}>
                            <SelectTrigger id="status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="watchlist">📋 Quero Ver (Watchlist)</SelectItem>
                                <SelectItem value="watching">▶️ Assistindo Agora (Watching)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Quem escolheu? (Só aparece se watching) */}
                    {status === 'watching' && (
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Quem escolheu?</Label>
                            <RadioGroup value={chosenBy} onValueChange={(v) => setChosenBy(v as 'Dan' | 'Carol')}>
                                <div className="flex gap-3">
                                    <div className={`flex-1 relative rounded-lg border-2 transition-all ${chosenBy === 'Dan'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}>
                                        <RadioGroupItem value="Dan" id="dan" className="sr-only" />
                                        <Label
                                            htmlFor="dan"
                                            className="flex items-center justify-center p-4 cursor-pointer"
                                        >
                                            <span className={`font-semibold ${chosenBy === 'Dan' ? 'text-primary' : 'text-foreground'
                                                }`}>
                                                Dan 💙
                                            </span>
                                        </Label>
                                    </div>

                                    <div className={`flex-1 relative rounded-lg border-2 transition-all ${chosenBy === 'Carol'
                                        ? 'border-secondary bg-secondary/5'
                                        : 'border-border hover:border-secondary/50'
                                        }`}>
                                        <RadioGroupItem value="Carol" id="carol" className="sr-only" />
                                        <Label
                                            htmlFor="carol"
                                            className="flex items-center justify-center p-4 cursor-pointer"
                                        >
                                            <span className={`font-semibold ${chosenBy === 'Carol' ? 'text-secondary' : 'text-foreground'
                                                }`}>
                                                Carol 💗
                                            </span>
                                        </Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    {/* Botão Confirmar */}
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            'Confirmar e Salvar'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
