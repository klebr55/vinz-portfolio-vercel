import type { PrototypeLocale } from './prototype-copy';

export type CaseField = { label: string; text: string; verified: boolean };

export type EditorialCase = {
  slug: 'sdimt' | 'nks' | 'milan' | 'sincad' | 'criactive';
  title: string;
  purpose: CaseField;
  need: CaseField;
  contribution: CaseField;
  technologies: CaseField;
  media: { poster: string; mockup?: string; mobileMockup?: string; video?: string; alt: string };
  link: string;
  treatment: 'screen-to-editorial' | 'pending';
};

export const editorialCases: Record<PrototypeLocale, EditorialCase[]> = {
  'pt-br': [
    {
      slug: 'sdimt', title: 'SDIMT',
      purpose: { label: 'Propósito', text: 'Apresentar o SDIMT em sua experiência pública de entrada.', verified: true },
      need: { label: 'Contexto', text: 'A landing pública apresenta o sistema e seu acesso.', verified: true },
      contribution: { label: 'Contribuição de Vinícius', text: 'Escopo individual ainda não comprovado.', verified: false },
      technologies: { label: 'Tecnologias', text: 'Atribuição técnica individual ainda não comprovada.', verified: false },
      media: { poster: '/awwwards/sdimt/landing-desktop.webp', alt: 'Captura da landing pública do SDIMT em 30 de setembro de 2026' },
      link: 'https://sdimt-seplag.lovable.app/?panel=home', treatment: 'pending',
    },
    {
      slug: 'nks', title: 'NKS Connect',
      purpose: { label: 'Propósito', text: 'Apresentar uma oferta de criação de sites por assinatura e conduzir visitantes aos planos e canais de contato.', verified: true },
      need: { label: 'Necessidade', text: 'O site publicado comunica opções de assinatura, recursos, programa de afiliados e meios de pagamento em um percurso único.', verified: true },
      contribution: { label: 'Contribuição de Vinícius', text: 'O portfólio original publica este website como projeto de Vinícius. Escopo individual, autoria do design e responsabilidades técnicas ainda aguardam confirmação.', verified: false },
      technologies: { label: 'Tecnologias observadas', text: 'HTML, CSS e JavaScript são observáveis no site acessível; arquivos jQuery e Bootstrap são carregados pela página. A stack atribuível ao trabalho de Vinícius segue pendente.', verified: false },
      media: { poster: '/awwwards/nks-editorial-poster.jpg', mockup: '/awwwards/nks-editorial-mockup.svg', mobileMockup: '/awwwards/nks-editorial-mockup-mobile.svg', video: '/awwwards/nks-editorial-seek.mp4', alt: 'Mockup editorial de NKS Connect com capturas reais da abertura, planos e rodapé' },
      link: 'https://honeydew-cobra-953075.hostingersite.com/', treatment: 'screen-to-editorial',
    },
    {
      slug: 'milan', title: 'Milan Móveis',
      purpose: { label: 'Propósito', text: 'Website para Milan Móveis, conforme o portfólio original.', verified: true },
      need: { label: 'Necessidade', text: 'Pendente de confirmação.', verified: false },
      contribution: { label: 'Contribuição de Vinícius', text: 'Pendente de confirmação.', verified: false },
      technologies: { label: 'Tecnologias', text: 'Pendente de confirmação.', verified: false },
      media: { poster: '/iPhoneMockup.svg', alt: 'Mídia publicada de Milan Móveis' }, link: 'https://milanmoveis.com.br', treatment: 'pending',
    },
    {
      slug: 'sincad', title: 'Sincad-MT',
      purpose: { label: 'Propósito', text: 'Website para o sindicato de comércio atacadista e distribuidor do Estado de Mato Grosso, conforme o portfólio original.', verified: true },
      need: { label: 'Necessidade', text: 'Pendente de confirmação.', verified: false },
      contribution: { label: 'Contribuição de Vinícius', text: 'Pendente de confirmação.', verified: false },
      technologies: { label: 'Tecnologias', text: 'Pendente de confirmação.', verified: false },
      media: { poster: '/LaptopMockup2.svg', alt: 'Mídia publicada de Sincad-MT' }, link: 'https://sincadmt.org.br', treatment: 'pending',
    },
    {
      slug: 'criactive', title: 'Criactive Design',
      purpose: { label: 'Propósito', text: 'Website para a agência Criactive Design, conforme o portfólio original.', verified: true },
      need: { label: 'Necessidade', text: 'Pendente de confirmação.', verified: false },
      contribution: { label: 'Contribuição de Vinícius', text: 'Pendente de confirmação.', verified: false },
      technologies: { label: 'Tecnologias', text: 'Pendente de confirmação.', verified: false },
      media: { poster: '/LaptopMockup4.svg', alt: 'Mídia publicada de Criactive Design' }, link: 'https://criactivedesign.com.br', treatment: 'pending',
    },
  ],
  en: [
    {
      slug: 'sdimt', title: 'SDIMT',
      purpose: { label: 'Purpose', text: 'Introduce SDIMT through its public entry experience.', verified: true },
      need: { label: 'Context', text: 'The public landing introduces the system and its access route.', verified: true },
      contribution: { label: 'Vinícius’s contribution', text: 'Individual scope is not yet verified.', verified: false },
      technologies: { label: 'Technologies', text: 'Individual technical attribution is not yet verified.', verified: false },
      media: { poster: '/awwwards/sdimt/landing-desktop.webp', alt: 'Public SDIMT landing captured on September 30, 2026' },
      link: 'https://sdimt-seplag.lovable.app/?panel=home', treatment: 'pending',
    },
    {
      slug: 'nks', title: 'NKS Connect',
      purpose: { label: 'Purpose', text: 'Present a subscription website service and guide visitors to plans and contact routes.', verified: true },
      need: { label: 'Need', text: 'The published site brings subscription options, features, an affiliate programme and payment methods into one journey.', verified: true },
      contribution: { label: 'Vinícius’s contribution', text: 'The original portfolio lists this website as Vinícius’s project. His individual scope, design authorship and technical responsibilities still need confirmation.', verified: false },
      technologies: { label: 'Observed technologies', text: 'HTML, CSS and JavaScript are visible on the accessible site; the page loads jQuery and Bootstrap files. The stack attributable to Vinícius’s work remains unconfirmed.', verified: false },
      media: { poster: '/awwwards/nks-editorial-poster.jpg', mockup: '/awwwards/nks-editorial-mockup.svg', mobileMockup: '/awwwards/nks-editorial-mockup-mobile.svg', video: '/awwwards/nks-editorial-seek.mp4', alt: 'Editorial NKS Connect mockup with real screenshots of the opening, plans and footer' },
      link: 'https://honeydew-cobra-953075.hostingersite.com/', treatment: 'screen-to-editorial',
    },
    {
      slug: 'milan', title: 'Milan Móveis',
      purpose: { label: 'Purpose', text: 'Website for Milan Móveis, as listed in the original portfolio.', verified: true },
      need: { label: 'Need', text: 'Awaiting confirmation.', verified: false },
      contribution: { label: 'Vinícius’s contribution', text: 'Awaiting confirmation.', verified: false },
      technologies: { label: 'Technologies', text: 'Awaiting confirmation.', verified: false },
      media: { poster: '/iPhoneMockup.svg', alt: 'Published Milan Móveis media' }, link: 'https://milanmoveis.com.br', treatment: 'pending',
    },
    {
      slug: 'sincad', title: 'Sincad-MT',
      purpose: { label: 'Purpose', text: 'Website for the wholesale and distribution trade union of Mato Grosso, as listed in the original portfolio.', verified: true },
      need: { label: 'Need', text: 'Awaiting confirmation.', verified: false },
      contribution: { label: 'Vinícius’s contribution', text: 'Awaiting confirmation.', verified: false },
      technologies: { label: 'Technologies', text: 'Awaiting confirmation.', verified: false },
      media: { poster: '/LaptopMockup2.svg', alt: 'Published Sincad-MT media' }, link: 'https://sincadmt.org.br', treatment: 'pending',
    },
    {
      slug: 'criactive', title: 'Criactive Design',
      purpose: { label: 'Purpose', text: 'Website for Criactive Design, as listed in the original portfolio.', verified: true },
      need: { label: 'Need', text: 'Awaiting confirmation.', verified: false },
      contribution: { label: 'Vinícius’s contribution', text: 'Awaiting confirmation.', verified: false },
      technologies: { label: 'Technologies', text: 'Awaiting confirmation.', verified: false },
      media: { poster: '/LaptopMockup4.svg', alt: 'Published Criactive Design media' }, link: 'https://criactivedesign.com.br', treatment: 'pending',
    },
  ],
};

export function publicCaseFields(caseData: EditorialCase): readonly CaseField[] {
  return [caseData.purpose, caseData.need, caseData.contribution, caseData.technologies]
    .filter((field) => field.verified);
}
