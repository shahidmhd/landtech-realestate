import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Linkedin, Youtube, ArrowUpRight } from 'lucide-react';
import { siteUrl, phoneLink, whatsappLink } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';
import ContactForm from '@/components/contact/ContactForm';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

// DIFC, Dubai (Burj Daman approx.)
const COORDS = { lat: 25.2114, lng: 55.2807 };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('hero_title'),
    description: t('hero_subtitle'),
    alternates: {
      canonical: siteUrl(`/${locale}/contact`),
      languages: {
        en: siteUrl('/en/contact'),
        ar: siteUrl('/ar/contact'),
        'x-default': siteUrl('/en/contact'),
      },
    },
    openGraph: {
      title: t('hero_title'),
      description: t('hero_subtitle'),
      url: siteUrl(`/${locale}/contact`),
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tFoot = await getTranslations('footer');

  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+971 4 000 0000';
  const email = process.env.NEXT_PUBLIC_EMAIL || 'info@example.com';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971500000000';
  const mapSrc = `https://maps.google.com/maps?q=${COORDS.lat},${COORDS.lng}&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}`;

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-800/40 via-ink-900 to-ink-900" />
        <div className="absolute -right-32 top-12 -z-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />
        <div className="container-luxe">
          <p className="eyebrow">{t('hero_eyebrow')}</p>
          <h1 className="mt-5 display text-5xl text-ivory md:text-7xl">{t('hero_title')}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/65 md:text-lg">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      {/* form + info */}
      <section className="pb-24 md:pb-32">
        <div className="container-luxe">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <ContactForm />

            <aside className="space-y-8">
              <div>
                <p className="eyebrow">{t('info_title')}</p>
                <h2 className="mt-3 display text-2xl text-ivory md:text-3xl">{t('info_title')}</h2>
              </div>

              <div className="space-y-4">
                <ContactRow
                  Icon={MapPin}
                  label={t('office')}
                  value={tFoot('address')}
                />
                <ContactRow
                  Icon={Phone}
                  label={t('phone_label')}
                  value={phone}
                  href={phoneLink()}
                />
                <ContactRow
                  Icon={MessageCircle}
                  label={t('whatsapp_label')}
                  value={`+${whatsapp}`}
                  href={whatsappLink('Hello!')}
                  external
                />
                <ContactRow
                  Icon={Mail}
                  label={t('email_label')}
                  value={email}
                  href={`mailto:${email}`}
                />
                <ContactRow
                  Icon={Clock}
                  label={t('hours_label')}
                  value={t('hours')}
                />
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-gold/85">{tFoot('social')}</p>
                <div className="mt-4 flex gap-3">
                  {[
                    { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                    { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                    { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                    { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
                  ].map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-ivory/75 transition-all hover:border-gold hover:text-gold"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* map */}
      <section className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="container-luxe">
          <div className="max-w-3xl">
            <p className="eyebrow">{t('map_title')}</p>
            <h2 className="mt-3 display text-3xl text-ivory md:text-5xl">{t('map_title')}</h2>
          </div>
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/[0.08]">
            <iframe
              src={mapSrc}
              title="Office location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[21/9] w-full grayscale-[0.4] contrast-110"
              allowFullScreen
            />
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-ink-900/85 px-5 py-3 text-xs uppercase tracking-[0.24em] text-ivory backdrop-blur-md transition-colors hover:bg-gold hover:text-ink-900"
            >
              <ArrowUpRight className="h-4 w-4" /> {t('directions')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  Icon, label, value, href, external,
}: {
  Icon: typeof MapPin;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <span className="flex items-start gap-4">
      <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/45">{label}</span>
        <span className="mt-1 block text-base text-ivory">{value}</span>
      </span>
    </span>
  );
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block transition-colors hover:text-gold"
      >
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}
