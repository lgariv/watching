import Link from "next/link"
import { Button } from "@heroui/react"
import { ArrowRight, Film, Tv, Search, Shield, Sparkles, Check, X } from "lucide-react"
import { ShineBorder } from "@/components/magicui/shine-border"
import {
	Card,
	CardHeader,
  CardFooter,
  CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-36">
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
                <div className="text-4xl font-light tracking-tight font-chakra">
                  Watching
                </div>
              </div>

              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Powered by AI
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Find your next <span className="text-primary font-chakra">binge-worthy</span> watch
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                Swipe, match, and discover personalized movie and TV show recommendations tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/search">
                  <Button color="primary" size="lg" className="h-12 px-8 text-base">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="bordered" className="h-12 px-8 text-base">
                    About Watching
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 pt-4 px-4 py-3 bg-muted/50 rounded-lg border border-border/50">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-medium">Privacy first.</span> We don't save your personal data or share your viewing
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
                <div className="px-6 pt-6">
                  <div className="aspect-[1/1] rounded-t-lg overflow-hidden bg-muted relative group">
                    <img
                      src="/demo.png"
                      alt="Results Demo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <ShineBorder borderWidth={2} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
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
              <Button color="primary" size="lg" className="h-12 px-8 text-base">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple Pricing</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">Choose the plan that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="flex flex-col h-full rounded-xl">
              <CardHeader className="flex flex-col space-y-1.5 pb-6">
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <CardDescription>Perfect for casual viewers</CardDescription>
                <div className="mt-4 flex items-baseline text-center justify-center">
                  <span className="text-5xl font-extrabold tracking-tight">$0</span>
                  <span className="ml-1 text-xl font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Up to 5 recommendations per day</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Share your recommendations with friends</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-5 w-5 text-danger mr-2 flex-shrink-0" />
                    <span>No learning over time <span className="text-muted-foreground">(coming soon)</span></span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SignUpButton>
                  <Button variant="bordered" className="w-full">Sign Up Free</Button>
                </SignUpButton>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="flex flex-col h-full relative overflow-hidden border-primary rounded-xl">
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-xl">
                  POPULAR
                </div>
              </div>
              <CardHeader className="flex flex-col space-y-1.5 pb-6">
                <CardTitle className="text-2xl font-bold">Premium</CardTitle>
                <CardDescription>For serious binge-watchers</CardDescription>
                <div className="mt-4 flex items-baseline text-center justify-center">
                  <span className="text-5xl font-extrabold tracking-tight">$2</span>
                  <span className="ml-1 text-xl font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Up to 1000 recommendations per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Share your recommendations with friends</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Browse through your recommendations history <span className="text-muted-foreground">(coming soon)</span></span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>An advanced AI agent that learns your preferences over time <span className="text-muted-foreground">(coming soon)</span></span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button color="primary" className="w-full" isDisabled>Coming Soon</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

