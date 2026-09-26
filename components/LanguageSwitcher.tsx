import { useLocale } from "next-intl";

const locales = [
  { code: "pt-br", label: "PT-BR", language: "Português" },
  { code: "en", label: "EN", language: "English" },
] as const;

export default function LanguageSwitcher() {
  const currentLocale = useLocale();

  return (
    <nav
      aria-label={currentLocale === "pt-br" ? "Idioma" : "Language"}
      className="flex items-center gap-2 whitespace-nowrap"
    >
      {locales.map(({ code, label, language }) => (
        <a
          key={code}
          href={`/${code}`}
          lang={code}
          aria-label={language}
          aria-current={currentLocale === code ? "page" : undefined}
          className="rounded px-1 py-2 text-xs font-semibold text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black-100"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
