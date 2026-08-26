import type { Metadata } from "next";
import { Roboto, Ubuntu } from "next/font/google";
import "../styles/globals.css";
import { AppProviders } from "../components/providers/AppProviders";
import ConditionalSiteLayout from "@/components/layout/ConditionalSiteLayout";
import { ContentProtection } from "@/components/ContentProtection";
import Script from "next/script";
import { getGlobalSettingsServerAPI } from "@/store/server-api/serverSideAPIs";

export const revalidate = 300;

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
  const res = await getGlobalSettingsServerAPI();
  const data = res?.data ?? null;

  if (data) {
    const title = data?.meta_title || data?.platformName || 'TaalumaWorld';
    const description = data?.meta_description || data?.platformDescription || '';
    const ogTitle = data?.og_title || title;
    const ogDescription = data?.og_description || description;
    const ogImage = data?.og_image || data?.logo || undefined;

    return {
      title,
      description,
      keywords: data?.meta_keywords || '',
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        siteName: data?.platformName || 'TaalumaWorld',
        type: 'website',
        ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      },
      twitter: {
        card: ogImage ? 'summary_large_image' : 'summary',
        title: ogTitle,
        description: ogDescription,
        ...(ogImage ? { images: [ogImage] } : {}),
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
  const res = await getGlobalSettingsServerAPI();
  const globalSettings = res?.data ?? null;
  // const logo = globalSettings?.logo ?? '/images/new-logo.webp';
  const logo = '/images/new-logo.webp';
  const contentMode = globalSettings?.visible ?? '';

  return (
    <html lang="en" className={`${roboto.variable} ${ubuntu.variable}`} suppressHydrationWarning>
      <head>
        {/* Schema Markup / JSON-LD */}
        {(globalSettings?.json_ld || globalSettings?.schema_markup) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: globalSettings?.json_ld || globalSettings?.schema_markup,
            }}
          />
        )}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Google Analytics — afterInteractive avoids beforeInteractive head hydration races */}
        {globalSettings?.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${globalSettings.google_analytics_id}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${globalSettings.google_analytics_id}');`}
            </Script>
          </>
        )}

        {/* Google Tag Manager */}
        {globalSettings?.google_tag_manager && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${globalSettings.google_tag_manager}');`}
          </Script>
        )}

        {process.env.NEXT_PUBLIC_ENABLE_CONTENT_PROTECTION !== "false" && (
          <ContentProtection />
        )}
        <AppProviders>
          <ConditionalSiteLayout logo={logo} contentMode={contentMode}>
            {children}
          </ConditionalSiteLayout>
        </AppProviders>
      </body>
    </html>
  );
}
