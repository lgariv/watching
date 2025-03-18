import type React from "react"
import "@/styles/globals.css"
import { Inter, Chakra_Petch } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link"
import { Film } from "lucide-react"
import {Button, HeroUIProvider} from "@heroui/react";
import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] })
const chakraFont = Chakra_Petch({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-chakra",
})

export const metadata = {
  title: "Watching - Movie & Show Recommendations",
  description: "Discover your next favorite movie or TV show with personalized recommendations",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/icon-light.png',
        href: '/icon-light.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/icon-dark.png',
        href: '/icon-dark.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} ${chakraFont.variable}`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
              <HeroUIProvider>
                <header className="px-6 lg:px-8 h-16 flex items-center border-b bg-background/80 fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
                  <Link className="flex items-center justify-center" href="/">
                    <Film className="h-6 w-6 mr-2 text-primary" />
                    <span className="font-light text-lg font-chakra">Watching</span>
                  </Link>
                  <nav className="ml-auto flex gap-2 sm:gap-4">
                    <Link className="text-sm font-medium self-center hover:text-primary" href="/about">
                      About
                    </Link>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button variant="flat" color="primary">Sign In</Button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </nav>
                </header>
                <main className="flex-1">
                  {children}
                </main>
              </HeroUIProvider>
            </div>
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}



import './globals.css'