import type { Metadata } from "next";
import { Roboto, Ubuntu } from "next/font/google";
import "../styles/globals.css";
import { AppProviders } from "../components/providers/AppProviders";
import ConditionalSiteLayout from "@/components/layout/ConditionalSiteLayout";
import { ContentProtection } from "@/components/ContentProtection";
import { API_BASE_URL } from "@/utils/config";
import Script from "next/script";

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

async function fetchGlobalSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}user/get-global`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchGlobalSettings();

  if (data) {
    return {
      title: data?.meta_title || data?.marketplace_name || data?.platformName || 'TaalumaWorld',
      description: data?.meta_description || data?.platformDescription || '',
      keywords: data?.meta_keywords || '',
      openGraph: {
        title: data?.meta_title || data?.marketplace_name || data?.platformName || 'TaalumaWorld',
        description: data?.meta_description || data?.platformDescription || '',
      },
    };
  }

  return {
    title: 'TaalumaWorld',
    description: '',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSettings = await fetchGlobalSettings();

  return (
    <html lang="en" className={`${roboto.variable} ${ubuntu.variable}`}>
      <head>
        {/* Google Analytics */}
        {globalSettings?.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${globalSettings?.google_analytics_id}`}
              strategy="beforeInteractive"
            />
            <Script id="ga-init" strategy="beforeInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${globalSettings?.google_analytics_id}');`}
            </Script>
          </>
        )}

        {/* Google Tag Manager */}
        {globalSettings?.google_tag_manager && (
          <Script id="gtm-init" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${globalSettings?.google_tag_manager}');`}
          </Script>
        )}

        {/* Schema Markup / JSON-LD */}
        {globalSettings?.schema_markup && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: globalSettings?.schema_markup }}
          />
        )}
      </head>
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
