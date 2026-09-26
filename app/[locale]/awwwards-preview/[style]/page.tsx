import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import StoryPrototype from '@/components/awwwards/StoryPrototype';
import { prototypeCopy, type PrototypeLocale, type PrototypeStyle } from '@/components/awwwards/prototype-copy';

type Params = Promise<{ locale: string; style: string }>;

export function generateStaticParams() {
  return (['pt-br', 'en'] as const).flatMap((locale) =>
    (['ember', 'spectral'] as const).map((style) => ({ locale, style })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'en' ? 'Kleber Vinícius · Direction preview' : 'Kleber Vinícius · Prévia de direção',
    robots: { index: false, follow: false },
  };
}

export default async function AwwwardsPreview({ params }: { params: Params }) {
  const { locale, style } = await params;

  if ((locale !== 'pt-br' && locale !== 'en') || (style !== 'ember' && style !== 'spectral')) {
    notFound();
  }

  return <StoryPrototype locale={locale as PrototypeLocale} style={style as PrototypeStyle} copy={prototypeCopy[locale as PrototypeLocale]} />;
}
