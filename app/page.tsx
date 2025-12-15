'use client';

import { useState } from 'react';
import { DramaSearch } from '@/components/drama-search';
import { DramaStats } from '@/components/DramaStats';
import { ContinueWatchingCarousel } from '@/components/ContinueWatchingCarousel';
import { ContinueWatchingCard } from '@/components/ContinueWatchingCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
        {/* Header K-Pop Style */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
          <div className="container max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Saudação */}
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 bg-clip-text text-transparent">
                  Annyeong! ✌️
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Dan & Carol&apos;s Drama Tracker
                </p>
              </div>

              {/* Avatar */}
              <Avatar className="h-12 w-12 border-2 border-purple-300 shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
                  D&C
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Stats Card */}
          {!isLoading && <DramaStats dramas={dramas} />}

          {/* Continue Watching Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Continue Watching 📺</h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <ContinueWatchingCarousel dramas={watching} />
            )}
          </section>

          {/* My List (Tabs) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">My List 📝</h2>

            <Tabs defaultValue="watchlist" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-sm">
                <TabsTrigger value="watchlist">Quero Ver</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
              </TabsList>

              {/* Aba: Quero Ver */}
              <TabsContent value="watchlist" className="mt-6 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  </div>
                ) : watchlist.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {watchlist.map((drama) => (
                      <ContinueWatchingCard key={drama.id} drama={drama} firestoreId={drama.firestoreId} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3 bg-white rounded-xl shadow-sm p-8">
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
              <TabsContent value="completed" className="mt-6 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  </div>
                ) : completed.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {completed.map((drama) => (
                      <ContinueWatchingCard key={drama.id} drama={drama} firestoreId={drama.firestoreId} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3 bg-white rounded-xl shadow-sm p-8">
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
        </div>
      </main>

      {/* Botão Flutuante (FAB) + Sheet de Busca */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 hover:scale-110 transition-all"
          >
            <Plus className="h-8 w-8" />
            <span className="sr-only">Adicionar Drama</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 bg-clip-text text-transparent">
              Buscar Dorama
            </SheetTitle>
          </SheetHeader>

          <DramaSearch />
        </SheetContent>
      </Sheet>
    </>
  );
}
