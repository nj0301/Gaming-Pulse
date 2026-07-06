import type { Metadata } from "next";
import { Inter, Rajdhani, Space_Grotesk } from "next/font/google";
import { getNavigation, getSiteSettings } from "@/lib/cms";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { EffectsProvider } from "@/components/motion/effects-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Gaming news, releases and industry insight`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Real-time gaming news aggregated from major outlets, plus a real games database with covers, release dates and store links.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: "/media/og-default.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [navigation, settings] = await Promise.all([getNavigation(), getSiteSettings()]);

  return (
    <html lang="en" data-effects="full">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${rajdhani.variable}`}>
        <JsonLd data={organizationJsonLd()} />
        <EffectsProvider>
          <Header primaryNav={navigation.primary} />
          <main id="main-content">{children}</main>
          <Footer footerNav={navigation.footer} settings={settings} />
        </EffectsProvider>
      </body>
    </html>
  );
}
