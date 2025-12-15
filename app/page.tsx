'use client';

import { useState } from 'react';
import { ContinueWatchingCard } from '@/components/ContinueWatchingCard';
import { DramaSearch } from '@/components/drama-search';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useDramas } from '@/hooks/useDramas';
import { Plus, Loader2 } from 'lucide-react';

export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { dramas, isLoading } = useDramas();

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

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : dramas.filter((d) => d.status === 'watching').length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dramas
                .filter((d) => d.status === 'watching')
                .map((drama) => (
                  <ContinueWatchingCard key={drama.id} drama={drama} />
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              Nenhum dorama em andamento. Clique no botão <span className="text-primary font-semibold">+</span> para adicionar!
            </p>
          )}
        </section>

        {/* Completados */}
        <section className="container max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-semibold mb-6">Completados</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : dramas.filter((d) => d.status === 'completed').length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {dramas
                .filter((d) => d.status === 'completed')
                .map((drama) => (
                  <ContinueWatchingCard key={drama.id} drama={drama} />
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              Nenhum dorama completado ainda.
            </p>
          )}
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
