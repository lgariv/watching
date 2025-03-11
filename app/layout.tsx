import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link"
import { Film } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Watching - Movie & Show Recommendations",
  description: "Discover your next favorite movie or TV show with personalized recommendations",
  icon: [
    {
      media: '(prefers-color-scheme: light)',
      url: '/images/favicon-light.svg',
      href: '/images/favicon-light.svg',
    },
    {
      media: '(prefers-color-scheme: dark)',
      url: '/images/favicon-dark.svg',
      href: '/images/favicon-dark.svg',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
              {children}
            </main>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'