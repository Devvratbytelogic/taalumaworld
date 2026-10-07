import type { Metadata } from "next";
import { Roboto, Ubuntu } from "next/font/google";
import "../styles/globals.css";
import { AppProviders } from "../components/providers/AppProviders";
import ConditionalSiteLayout from "@/components/layout/ConditionalSiteLayout";
import { ContentProtection } from "@/components/ContentProtection";
import Script from "next/script";
import { getGlobalSettingsServerAPI } from "@/store/server-api/serverSideAPIs";
import { DEFAULT_BRAND_LOGO } from "@/constants/common";
import { toPublicSiteSettings } from "@/utils/publicPagePayload";

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
    const twitterTitle = data?.twitter_title || ogTitle;
    const twitterDescription = data?.twitter_description || ogDescription;
    const twitterImage = data?.twitter_image || ogImage;

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
        card: twitterImage ? 'summary_large_image' : 'summary',
        title: twitterTitle,
        description: twitterDescription,
        ...(twitterImage ? { images: [twitterImage] } : {}),
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
  const logo = globalSettings?.logo || DEFAULT_BRAND_LOGO;
  const contentMode = globalSettings?.visible ?? '';
  const clientSettings = toPublicSiteSettings(globalSettings);

  return (
    <html lang="en" className={`${roboto.variable} ${ubuntu.variable}`} suppressHydrationWarning>
      <head>
        {/* ========================================= */}
        {/* FACEBOOK DOMAIN VERIFICATION */}
        {/* ========================================= */}

        {globalSettings?.facebook_domain_verification && (
          <meta
            name="facebook-domain-verification"
            content={
              globalSettings.facebook_domain_verification
            }
          />
        )}


        {/* ========================================= */}
        {/* BING DOMAIN VERIFICATION */}
        {/* ========================================= */}

        {globalSettings?.bing_verification_code && (
          <meta
            name="msvalidate.01"
            content={
              globalSettings.bing_verification_code
            }
          />
        )}


        {/* ========================================= */}
        {/* SCHEMA MARKUP / JSON-LD */}
        {/* ========================================= */}

        {(
          globalSettings?.json_ld ||
          globalSettings?.schema_markup
        ) && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html:
                  globalSettings?.json_ld ||
                  globalSettings?.schema_markup,
              }}
            />
          )}

      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* ========================================= */}
        {/* GOOGLE ANALYTICS */}
        {/* ========================================= */}

        {globalSettings?.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${globalSettings.google_analytics_id}`}
              strategy="afterInteractive"
            />

            <Script
              id="google-analytics"
              strategy="afterInteractive"
            >
              {`
                window.dataLayer = window.dataLayer || [];

                function gtag() {
                  dataLayer.push(arguments);
                }

                gtag('js', new Date());

                gtag(
                  'config',
                  '${globalSettings.google_analytics_id}'
                );
              `}
            </Script>
          </>
        )}


        {/* ========================================= */}
        {/* GOOGLE TAG MANAGER */}
        {/* ========================================= */}

        {globalSettings?.google_tag_manager && (
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
          >
            {`
              (function(w,d,s,l,i){
                w[l]=w[l]||[];

                w[l].push({
                  'gtm.start': new Date().getTime(),
                  event:'gtm.js'
                });

                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'
                      ? '&l='+l
                      : '';

                j.async=true;

                j.src=
                  'https://www.googletagmanager.com/gtm.js?id='
                  + i + dl;

                f.parentNode.insertBefore(j,f);

              })(window,document,'script','dataLayer','${globalSettings.google_tag_manager}');
            `}
          </Script>
        )}


        {/* ========================================= */}
        {/* FACEBOOK PIXEL */}
        {/* ========================================= */}

        {globalSettings?.facebook_pixel && (
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
          >
            {`
              !function(f,b,e,v,n,t,s)
              {
                if(f.fbq)return;

                n=f.fbq=function(){
                  n.callMethod ?
                  n.callMethod.apply(n,arguments) :
                  n.queue.push(arguments)
                };

                if(!f._fbq)f._fbq=n;

                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];

                t=b.createElement(e);
                t.async=!0;
                t.src=v;

                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }
              (
                window,
                document,
                'script',
                'https://connect.facebook.net/en_US/fbevents.js'
              );

              fbq(
                'init',
                '${globalSettings.facebook_pixel}'
              );

              fbq('track', 'PageView');
            `}
          </Script>
        )}


        {/* ========================================= */}
        {/* MICROSOFT CLARITY */}
        {/* ========================================= */}

        {globalSettings?.microsoft_clarity && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
          >
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){
                  (c[a].q=c[a].q||[]).push(arguments)
                };

                t=l.createElement(r);
                t.async=1;
                t.src="https://www.clarity.ms/tag/"+i;

                y=l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t,y);

              })(
                window,
                document,
                "clarity",
                "script",
                "${globalSettings.microsoft_clarity}"
              );
            `}
          </Script>
        )}


        {/* ========================================= */}
        {/* CONTENT PROTECTION */}
        {/* ========================================= */}

        {process.env.NEXT_PUBLIC_ENABLE_CONTENT_PROTECTION !== "false" && (
          <ContentProtection />
        )}
        <AppProviders>
          <ConditionalSiteLayout logo={logo} contentMode={contentMode} settings={clientSettings}>
            {children}
          </ConditionalSiteLayout>
        </AppProviders>
      </body>
    </html>
  );
}
