import type { Metadata } from "next";
import { Inter, Poppins, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { HydrationBoundary } from './hydration-boundary';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Bin - Intelligent Waste Management",
  description: "Revolutionize your waste management with our intelligent smart bin solution. Track, optimize, and reduce waste with cutting-edge technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
            <ClerkProvider 
              publishableKey="pk_test_Zmx5aW5nLW11c3RhbmctNTQuY2xlcmsuYWNjb3VudHMuZGV2JA"
            >
          <HydrationBoundary>
            {children}
          </HydrationBoundary>
        </ClerkProvider>
      </body>
    </html>
  );
}
