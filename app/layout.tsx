import type { Metadata } from "next";
import { DM_Serif_Display, Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://pastoralstack.com.au"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "PastoralStack — Digital Infrastructure for Agricultural Operations",
    template: "%s — PastoralStack",
  },
  description:
    "PastoralStack builds reliable, scalable digital systems for Australian stations, agribusinesses, and land management organisations. Custom software, integrations, and infrastructure built for the bush.",

  keywords: [
    "agricultural software",
    "agribusiness technology",
    "farm management software",
    "station management system",
    "rural digital infrastructure",
    "land management platform",
    "Australian agtech",
    "custom software development",
    "pastoral operations",
  ],

  authors: [{ name: "PastoralStack", url: siteUrl }],
  creator: "PastoralStack",
  publisher: "PastoralStack",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "PastoralStack",
    title: "PastoralStack — Digital Infrastructure for Agricultural Operations",
    description:
      "We build reliable, scalable digital systems for Australian stations, agribusinesses, and land management organisations.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PastoralStack — Digital Infrastructure for Agricultural Operations",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PastoralStack — Digital Infrastructure for Agricultural Operations",
    description:
      "We build reliable, scalable digital systems for Australian stations, agribusinesses, and land management organisations.",
    images: ["/og.png"],
    creator: "@pastoralstack",
  },

  alternates: {
    canonical: siteUrl,
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
