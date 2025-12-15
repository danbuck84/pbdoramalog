'use client';

import { useState } from 'react';
import { ContinueWatchingCard } from '@/components/ContinueWatchingCard';
import { DramaSearch } from '@/components/drama-search';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Drama } from '@/types/drama';
import { Plus } from 'lucide-react';

// Dados mock para demonstração
const mockDramas: Drama[] = [
  {
    id: '1',
    title: 'Crash Landing on You',
    poster_path: '/wlWGGe4t5sXo5Y99pM1B3H3lk15.jpg',
    status: 'watching',
    chosenBy: 'Carol',
    ratings: { dan: 4.5, carol: 5 },
    totalEpisodes: 16,
    watchedEpisodes: 8,
  },
  {
    id: '2',
    title: 'Goblin',
    poster_path: '/sYHJIt2CdJOv1cGofS7N23lTcVp.jpg',
    status: 'watching',
    chosenBy: 'Dan',
    ratings: { dan: 5, carol: 4.5 },
    totalEpisodes: 16,
    watchedEpisodes: 12,
  },
  {
    id: '3',
    title: 'Hotel Del Luna',
    poster_path: '/8KKLq6x9HyR5QY5hMqKbWX73Pkt.jpg',
    status: 'completed',
    chosenBy: 'Carol',
    ratings: { dan: 4, carol: 4.5 },
    totalEpisodes: 16,
    watchedEpisodes: 16,
  },
];


export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-md">
          <div className="container max-w-6xl mx-auto px-6 py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                PB DoramaLog
              </h1>
              <p className="text-muted-foreground mt-1">
                Tracker de Doramas: Dan & Carol 💙💗
              </p>
            </div>
          </div>
        </header>

        {/* Continue Assistindo */}
        <section className="container max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-semibold mb-6">Continue Assistindo</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockDramas
              .filter((d) => d.status === 'watching')
              .map((drama) => (
                <ContinueWatchingCard key={drama.id} drama={drama} />
              ))}
          </div>
        </section>

        {/* Completados */}
        <section className="container max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-semibold mb-6">Completados</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mockDramas
              .filter((d) => d.status === 'completed')
              .map((drama) => (
                <ContinueWatchingCard key={drama.id} drama={drama} />
              ))}
          </div>
        </section>
      </main>

      {/* Botão Flutuante (FAB) + Sheet de Busca */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 transition-all"
          >
            <Plus className="h-8 w-8" />
            <span className="sr-only">Adicionar Drama</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Buscar Dorama
            </SheetTitle>
          </SheetHeader>

          <DramaSearch />
        </SheetContent>
      </Sheet>
    </>
  );
}
