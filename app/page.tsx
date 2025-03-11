import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Film, Tv, Search, Shield, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-8 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Film className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-xl">Watching</span>
        </Link>
        {/* <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary" href="/about">
            About
          </Link>
        </nav> */}
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-background z-0"></div>
          <div
            className="absolute inset-0 z-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent z-0"></div>

          {/* Content */}
          <div className="container relative z-10 px-4 md:px-6 mx-auto pt-24 md:pt-32 lg:pt-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col space-y-6">
                {/* Logo */}
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-2xl mr-3">
                    <Film className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-3xl font-bold tracking-tight">
                    Watching
                  </div>
                </div>

                <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                  Powered by AI
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Find your next <span className="text-primary">binge-worthy</span> watch
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  Swipe, match, and discover personalized movie and TV show recommendations tailored just for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/search">
                    <Button size="lg" className="h-12 px-8 text-base">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  {/* <Link href="/about">
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                      About Watching
                    </Button>
                  </Link> */}
                </div>

                <div className="flex items-center gap-3 pt-4 px-4 py-3 bg-muted/50 rounded-lg border border-border/50">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">Privacy first.</span> We don't save your data or track your viewing
                    habits.
                  </p>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/5 rounded-full blur-2xl z-0"></div>
                <div className="relative z-10 bg-gradient-to-br from-background to-muted border rounded-xl shadow-xl overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="mx-auto text-sm font-medium text-muted-foreground">Watching App</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="aspect-[1/1] rounded-lg overflow-hidden bg-muted relative group">
                      <img
                        src="/demo.png"
                        alt="Results Demo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Three simple steps to get personalized recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-bold">Search Your Favorites</h3>
                <p className="text-muted-foreground">
                  Start by searching for up to 10 movies or shows you already love.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Tv className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-bold">Go Through Suggestions</h3>
                <p className="text-muted-foreground">
                  Like or dislike recommendations based on your initial selections.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-bold">Get AI Recommendations</h3>
                <p className="text-muted-foreground">Receive personalized top recommendations powered by AI.</p>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/search">
                <Button size="lg" className="h-12 px-8 text-base">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

