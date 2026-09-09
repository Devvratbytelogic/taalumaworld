import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Compass, LifeBuoy, Users2 } from 'lucide-react';
import {
  getAboutUsRoutePath,
  getAllAuthorsRoutePath,
  getContactUsRoutePath,
  getHomeRoutePath,
} from '@/routes/routes';

export const metadata: Metadata = {
  title: 'Page not found | TaalumaWorld',
  description:
    'This page does not exist or may have been moved. Browse blueprints, meet mentors, or visit the Help & Trust Center.',
};

const destinations = [
  {
    href: getHomeRoutePath(),
    icon: BookOpen,
    title: 'Browse Blueprints',
    description: 'Practical guidance from people who have walked the path.',
  },
  {
    href: getAllAuthorsRoutePath(),
    icon: Users2,
    title: 'Meet Mentors',
    description: 'A global roster of verified professionals.',
  },
  {
    href: getAboutUsRoutePath(),
    icon: Compass,
    title: 'Why Taaluma Exists',
    description: 'The story behind this marketplace.',
  },
  {
    href: getContactUsRoutePath(),
    icon: LifeBuoy,
    title: 'Help & Trust Center',
    description: 'Support, policies, and answers when you need them.',
  },
];

export default function NotFound() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(10_102_194/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(10_102_194/0.07)_1px,transparent_1px)] bg-[length:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-[90px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary-accent/15 blur-[90px]" />
      </div>

      <div className="container relative py-12 sm:py-16 lg:py-20">
        <div className="relative mx-auto max-w-3xl px-2 py-6 sm:px-8 sm:py-10">
          <span className="pointer-events-none absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-primary/30 sm:h-10 sm:w-10" aria-hidden />
          <span className="pointer-events-none absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-primary/30 sm:h-10 sm:w-10" aria-hidden />
          <span className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-primary/30 sm:h-10 sm:w-10" aria-hidden />
          <span className="pointer-events-none absolute right-0 bottom-0 h-8 w-8 border-b-2 border-r-2 border-primary/30 sm:h-10 sm:w-10" aria-hidden />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 sm:px-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-xs font-medium tracking-wide text-primary uppercase">
                Error 404
              </span>
            </div>

            <p
              aria-hidden
              className="gradient_text mt-5 select-none font-ubuntu text-7xl leading-none font-bold tracking-tighter sm:text-8xl md:text-[7.5rem]"
            >
              404
            </p>

            <h1 className="mt-4 text-balance font-ubuntu text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
              We couldn&apos;t find this page
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              The link may be outdated, or this page may have moved. Let&apos;s get you back to
              mentoring, learning, and career architecture.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <Link
                href={getHomeRoutePath()}
                className="global_btn rounded_full bg_primary w-full justify-center sm:w-auto"
              >
                Browse Blueprints
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
              <Link
                href={getAllAuthorsRoutePath()}
                className="global_btn rounded_full outline_primary w-full justify-center sm:w-auto"
              >
                Meet Mentors
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-4xl sm:mt-12">
          <p className="mb-3 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Popular destinations
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {destinations.map(({ href, icon: Icon, title, description }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary sm:p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-primary/5 text-primary transition-colors group-hover:border-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground transition-colors group-hover:text-primary">
                      {title}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
