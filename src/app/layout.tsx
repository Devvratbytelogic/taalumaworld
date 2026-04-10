import type { Metadata } from "next";
import { Roboto, Ubuntu } from "next/font/google";
import "../styles/globals.css";
import { AppProviders } from "../components/providers/AppProviders";
import ConditionalSiteLayout from "@/components/layout/ConditionalSiteLayout";
import { ContentProtection } from "@/components/ContentProtection";
import { API_BASE_URL } from "@/utils/config";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE_URL}user/get-global`, { next: { revalidate: 3600 } });
    const json = await res.json();
    const data = json?.data;

    return {
      title: data?.meta_title || data?.marketplace_name || data?.platformName || 'TaalumaWorld',
      description: data?.meta_description || data?.platformDescription || '',
      keywords: data?.meta_keywords || '',
      openGraph: {
        title: data?.meta_title || data?.marketplace_name || data?.platformName || 'TaalumaWorld',
        description: data?.meta_description || data?.platformDescription || '',
      },
    };
  } catch {
    return {
      title: 'TaalumaWorld',
      description: '',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${ubuntu.variable}`}>
      <body className="antialiased">
        <ContentProtection />
        <AppProviders>
          <ConditionalSiteLayout>
            {children}
          </ConditionalSiteLayout>
        </AppProviders>
      </body>
    </html>
  );
}
