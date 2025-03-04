import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Film, Tv } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Film className="h-6 w-6 mr-2" />
          <span className="font-bold">Watching</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Your Next Favorite Watch
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Swipe through personalized movie and show recommendations based on your taste.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/search">
                  <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted-foreground/20 p-3">
                  <Film className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Search Your Favorites</h3>
                <p className="text-muted-foreground">
                  Start by searching for up to 10 movies or shows you already love.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted-foreground/20 p-3">
                  <Tv className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Swipe Through Suggestions</h3>
                <p className="text-muted-foreground">
                  Like or dislike recommendations based on your initial selections.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted-foreground/20 p-3">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Get AI Recommendations</h3>
                <p className="text-muted-foreground">Receive personalized top 5 recommendations powered by AI.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Watching. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

