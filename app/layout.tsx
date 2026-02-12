import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { LanguageProvider } from "@/lib/lang-context";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: "ValoSkinsDB | Valorant Skin Roulette, Agent Picker & Pro Crosshairs",
    template: "%s | ValoSkinsDB",
  },
  description:
    "The cleanest ad-free Valorant toolkit. Randomize your next skin or agent, browse the full skin database, and copy pro player crosshairs instantly. Updated daily.",
  keywords: [
    "Valorant Skins",
    "Skin Roulette",
    "Agent Randomizer",
    "Valorant Crosshairs",
    "Pro Settings",
    "Ruleta Valorant",
    "Skins Valorant",
    "Valorant Crosshairs Español",
    "Precio Skins Valorant",
  ],
  openGraph: {
    title: "ValoSkinsDB | Skin Roulette, Agent Picker & Pro Crosshairs",
    description:
      "The cleanest ad-free Valorant toolkit. Randomize your next skin, check prices, and copy pro crosshairs.",
    url: "https://www.valoskinsdb.com",
    siteName: "ValoSkinsDB",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ValoSkinsDB | Valorant Tools",
    description: "The cleanest ad-free Valorant toolkit.",
  },
  verification: {
    google: "YjzaoQVBhHmL6tv9kMHUjwSwLotKb5n4v9L6nV9q1nQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0f1923] text-[#ece8e1] antialiased">
        <LanguageProvider>
          <GoogleAnalytics gaId="G-RW708L84MY" />
          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="mt-8 border-t border-[#ece8e1]/20 pt-4 text-[11px] uppercase tracking-widest text-[#ece8e1]/50">
              Unofficial Valorant fan project. Valorant is a trademark of Riot
              Games.
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
