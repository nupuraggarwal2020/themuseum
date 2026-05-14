import type { Metadata } from "next";
import { Caveat, Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";

import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

/*
 * Active display/UI/body/mono/hand family across the whole site:
 *   Kobe 1.1 (VJ-Type, trial OTF, 3 weights × 2 styles =
 *   Regular / RegularOblique / Bold / BoldOblique / Black / BlackOblique).
 *
 * Category (also VJ-Type), Newsreader, Inter, JetBrains Mono, and Caveat
 * remain registered so a revert is a CSS-only edit in app/globals.css —
 * flip the --font-* tokens back to their previous mappings (recorded
 * inline there).
 */
const kobe = localFont({
  src: [
    {
      path: "./fonts/kobe/Kobe1.1-Regular-TRIAL.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/kobe/Kobe1.1-RegularOblique-TRIAL.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/kobe/Kobe1.1-Bold-TRIAL.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/kobe/Kobe1.1-BoldOblique-TRIAL.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/kobe/Kobe1.1-Black-TRIAL.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/kobe/Kobe1.1-BlackOblique-TRIAL.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-kobe",
  display: "swap",
});

const category = localFont({
  src: [
    {
      path: "./fonts/category/Category-Regular_TRIAL.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/category/Category-Regularitalic_TRIAL.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/category/Category-Medium_TRIAL.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/category/Category-Mediumitalic_TRIAL.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/category/Category-Bold_TRIAL.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/category/Category-Bolditalic_TRIAL.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/category/Category-Black_TRIAL.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/category/Category-Blackitalic_TRIAL.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-category",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://museum.example.com"),
  title: {
    default: "A Museum of Notetaking · Personal. Messy. Filed but never forgotten.",
    template: "%s · A Museum of Notetaking",
  },
  description:
    "Three case files. Two prototypes. One letter. A forensic archive of the ways I have not quite taken notes for ten years, and a sketch of the interactions that might have caught the next thought.",
  authors: [{ name: "Nupur, for Granola" }],
  openGraph: {
    title: "A Museum of Notetaking",
    description:
      "Personal. Messy. Filed but never forgotten. A forensic archive of notetaking, for Granola.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Museum of Notetaking",
    description:
      "Personal. Messy. Filed but never forgotten. A forensic archive, for Granola.",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1d1c" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${kobe.variable} ${category.variable} ${inter.variable} ${newsreader.variable} ${jetbrains.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Inline FOUC-prevention script. Stamps data-theme on <html>
            before paint so the runtime light/dark palette is in place
            on the first frame. Must be the first body child. */}
        <ThemeScript />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-rule focus:bg-paper focus:px-3 focus:py-2 focus:text-[12px] focus:text-ink-900"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
