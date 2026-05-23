export default function SectionHeading({
  eyebrow, title, subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="max-w-3xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-4 display text-3xl text-ivory md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm leading-relaxed text-ivory/65 md:text-base">{subtitle}</p>}
    </header>
  );
}
