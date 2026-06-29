import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress";
import { SiteHeader } from "@/components/site-header";
import { LocalizedMeta } from "@/components/localized-meta";
import { ui } from "@/content/ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Static default for the initial server render and crawlers. The English
// strings live in the ui dictionary so there is one source of truth; once the
// app hydrates, LocalizedMeta swaps the head to the learner's chosen language.
export const metadata: Metadata = {
  title: ui.en.meta.title,
  description: ui.en.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ProgressProvider>
          <LocalizedMeta />
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </ProgressProvider>
      </body>
    </html>
  );
}
