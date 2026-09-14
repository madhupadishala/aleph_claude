import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Aleph | Practice Growth Intelligence for Clinicians",
  description: "Aleph helps independent clinicians grow trusted, visible, and profitable practices through ethical positioning, pricing strategy, and patient footfall systems.",
  metadataBase: new URL("https://aleph.theclinixai.com"),
  openGraph: { title: "Aleph | Practice Growth Intelligence for Clinicians", description: "Turn clinical expertise into a trusted, visible, and growing practice.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={instrumentSerif.variable + " " + plusJakarta.variable}><body>{children}</body></html>;
}
