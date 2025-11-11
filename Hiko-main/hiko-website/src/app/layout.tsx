import type { Metadata } from "next";
import { Montserrat, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hiko - For the spirit of adventure and the joy of the trail",
  description: "Hiko is a social hiking platform designed specifically for New Zealand. Discover trails, track progress, share experiences, and enjoy the journey with friends while promoting health, adventure, and a deeper connection with New Zealand's natural landscapes.",
  keywords: "hiking, New Zealand, trails, outdoor, adventure, social, gamification, DOC, huts, camping",
  icons: {
    icon: '/favicon.png?v=2',
    shortcut: '/favicon.png?v=2',
    apple: '/favicon.png?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${sourceSans.variable} font-source-sans antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
