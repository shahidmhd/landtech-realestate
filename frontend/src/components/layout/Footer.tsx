import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Instagram, Facebook, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { phoneLink, whatsappLink } from '@/lib/utils';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tBrand = useTranslations('brand');
  const tSvc = useTranslations('services.items');

  const year = new Date().getFullYear();

  const services = [
    'sales', 'buying', 'rentals', 'commercial', 'villas',
    'apartments', 'penthouses', 'investment', 'offplan',
  ] as const;

  return (
    <footer className="relative isolate overflow-hidden bg-ink-900 pt-24 pb-10 text-ivory/75">
      <div className="pointer-events-none absolute inset-0 bg-radial-spot opacity-60" />
      <div className="container-luxe relative">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-3xl text-ivory">{tBrand('name')}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/65">
              {tBrand('tagline')}
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <FooterRow icon={<MapPin className="h-4 w-4" />} label={t('address_label')} value={t('address')} />
              <FooterRow icon={<Phone className="h-4 w-4" />} label={t('phone_label')} value={process.env.NEXT_PUBLIC_PHONE_NUMBER || '+971 4 000 0000'} href={phoneLink()} />
              <FooterRow icon={<Mail className="h-4 w-4" />} label={t('email_label')} value={process.env.NEXT_PUBLIC_EMAIL || 'info@example.com'} href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || 'info@example.com'}`} />
              <FooterRow icon={<Clock className="h-4 w-4" />} label={t('hours_label')} value={t('hours')} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>{tNav('home')}</FooterHeading>
            <ul className="mt-5 space-y-3 text-sm">
              {(['properties', 'services', 'projects', 'about', 'blog', 'contact'] as const).map((k) => (
                <li key={k}>
                  <Link href={`/${k === 'services' ? 'services' : k}` as never} className="transition-colors hover:text-gold">
                    {tNav(k)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>{tNav('services')}</FooterHeading>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((k) => (
                <li key={k}>
                  <Link href={`/services#${k}` as never} className="transition-colors hover:text-gold">
                    {tSvc(`${k}.t`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>{t('social')}</FooterHeading>
            <div className="mt-5 flex gap-3">
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
                  className="inline-grid h-11 w-11 place-items-center rounded-full border border-white/10 text-ivory/70 transition-all hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <a
              href={whatsappLink('Hello, I would like to enquire about a property.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-6 w-full"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="hairline mt-16" />

        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-ivory/50 md:flex-row md:items-center">
          <p>© {year} {tBrand('name')}. {t('rights')}</p>
          <p className="tracking-[0.18em] uppercase">{t('rera')}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold">{children}</h4>
  );
}

function FooterRow({
  icon, label, value, href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="flex items-start gap-3 leading-relaxed">
      <span className="mt-0.5 text-gold/80">{icon}</span>
      <span>
        <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/45">{label}</span>
        <span className="block text-ivory/85">{value}</span>
      </span>
    </span>
  );
  return href ? (
    <a href={href} className="transition-colors hover:text-gold">{content}</a>
  ) : (
    <div>{content}</div>
  );
}
