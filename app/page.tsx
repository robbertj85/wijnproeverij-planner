import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Wine, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Wine className="h-4 w-4" />
            Wijnproeverij Planner
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Organiseer de perfecte wijnproeverij
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Plan eenvoudig een wijnproeverij met vrienden. Stem over tijden, deel wijnen, en
            beoordeel samen jullie favorieten.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/events/new">
              <Button size="lg" className="w-full sm:w-auto">
                Start een evenement
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Meer informatie
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Hoe het werkt</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Calendar className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Plan tijden</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Stel meerdere tijdopties voor en laat gasten hun beschikbaarheid doorgeven
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Nodig uit</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Deel een unieke link met gasten. Geen account nodig om deel te nemen
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Wine className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Deel wijnen</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gasten kunnen hun wijnen toevoegen met automatische duplicaat detectie
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Beoordeel</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Na de proeverij: beoordeel wijnen en bekijk de resultaten samen
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-3xl border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Klaar om te beginnen?</CardTitle>
            <CardDescription className="text-base">
              Maak in een paar minuten je eerste wijnproeverij evenement aan
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/events/new">
              <Button size="lg">
                <Calendar className="h-5 w-5" />
                Evenement aanmaken
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Wijnproeverij Planner</p>
        </div>
      </footer>
    </div>
  );
}