import type { PrototypeLocale } from './prototype-copy';
import { publicCaseFields, type EditorialCase } from './case-content';

export function CaseEditorial({ caseData, locale }: { caseData: EditorialCase; locale: PrototypeLocale }) {
  const fields = publicCaseFields(caseData);
  return (
    <div className="awwwards-case-editorial">
      <dl>
        {fields.map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.text}</dd>
          </div>
        ))}
      </dl>
      <a href={caseData.link} target="_blank" rel="noopener noreferrer">
        {locale === 'pt-br' ? 'Visitar projeto' : 'Visit project'} <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
