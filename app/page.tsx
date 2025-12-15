'use client';

import { useState } from 'react';
import { ContinueWatchingCard } from '@/components/ContinueWatchingCard';
import { DramaSearch } from '@/components/drama-search';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useDramas } from '@/hooks/useDramas';
import { Plus, Loader2 } from 'lucide-react';

export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { dramas, isLoading } = useDramas();

  // Filtra por status
  const watching = dramas.filter(d => d.status === 'watching');
  const watchlist = dramas.filter(d => d.status === 'watchlist');
  const completed = dramas.filter(d => d.status === 'completed');

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

        {/* Tabs de Navegação */}
        <section className="container max-w-6xl mx-auto px-6 py-6">
          <Tabs defaultValue="watching" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="watching">Assistindo</TabsTrigger>
              <TabsTrigger value="watchlist">Quero Ver</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>

            {/* Aba: Assistindo */}
            <TabsContent value="watching" className="space-y-4">
              <h2 className="text-2xl font-semibold">Assistindo Agora</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : watching.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {watching.map((drama) => (
                    <ContinueWatchingCard key={drama.id} drama={drama} firestoreId={drama.firestoreId} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <p className="text-muted-foreground text-lg">
                    Nenhum dorama em andamento no momento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Clique no botão <span className="text-primary font-semibold">+</span> para adicionar!
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Aba: Quero Ver */}
            <TabsContent value="watchlist" className="space-y-4">
              <h2 className="text-2xl font-semibold">Lista: Quero Ver</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : watchlist.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {watchlist.map((drama) => (
                    <ContinueWatchingCard key={drama.id} drama={drama} firestoreId={drama.firestoreId} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <p className="text-muted-foreground text-lg">
                    Sua lista &quot;Quero Ver&quot; está vazia
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Adicione doramas que deseja assistir no futuro!
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Aba: Concluídos */}
            <TabsContent value="completed" className="space-y-4">
              <h2 className="text-2xl font-semibold">Completados</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : completed.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {completed.map((drama) => (
                    <ContinueWatchingCard key={drama.id} drama={drama} firestoreId={drama.firestoreId} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <p className="text-muted-foreground text-lg">
                    Nada concluído ainda? Bora maratonar! 🍿
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Doramas completados aparecerão aqui
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
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
