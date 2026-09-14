import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Aleph | Practice Growth Intelligence for Clinicians",
    template: "%s | Aleph"
  },
  description: "Aleph helps independent clinicians grow trusted, visible, and profitable practices through ethical positioning, pricing strategy, and patient footfall systems.",
  metadataBase: new URL("https://aleph.theclinixai.com"),
  applicationName: "Aleph",
  keywords: [
    "clinician growth",
    "doctor website",
    "clinic marketing",
    "local SEO for doctors",
    "practice growth",
    "patient footfall"
  ],
  authors: [{ name: "Aleph" }],
  creator: "Aleph",
  publisher: "Aleph",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Aleph | Practice Growth Intelligence for Clinicians",
    description: "Turn clinical expertise into a trusted, visible, and growing practice.",
    type: "website",
    siteName: "Aleph",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Aleph | Practice Growth Intelligence for Clinicians",
    description: "Turn clinical expertise into a trusted, visible, and growing practice."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#123629"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={instrumentSerif.variable + " " + plusJakarta.variable}><body>{children}</body></html>;
}
