import type { PrototypeLocale } from '../prototype-copy';
import type { ProcessStageId } from '../identity/process-model';

export type ProcessStageCopy = { id: ProcessStageId; title: string; explanation: string; participation: string; outcome: string };
export type ProcessCopy = { title: string; opening: string; stages: readonly [ProcessStageCopy, ProcessStageCopy, ProcessStageCopy] };

export const processContent: Record<PrototypeLocale, ProcessCopy> = {
  'pt-br': {
    title: 'Processo', opening: 'Da primeira conversa à entrega, cada etapa tem um propósito.',
    stages: [
      { id: 1, title: 'Descoberta e planejamento', explanation: 'Começo entendendo o problema, seus objetivos e quem vai usar a solução. A conversa vira um briefing e uma direção compartilhada para o projeto.', participation: 'Compartilhar contexto, objetivos e expectativas.', outcome: 'Briefing e direção alinhada para o trabalho.' },
      { id: 2, title: 'Desenvolvimento e acompanhamento', explanation: 'Transformo essa direção em uma solução que evolui com o projeto. Você acompanha o progresso e participa dos ajustes por meio de feedback.', participation: 'Acompanhar o progresso e compartilhar feedback.', outcome: 'Evolução da solução e ajustes durante o desenvolvimento.' },
      { id: 3, title: 'Finalização e lançamento', explanation: 'Revisamos o resultado em relação ao que foi combinado, fechamos os ajustes e preparamos a entrega para o público que vai utilizar a solução.', participation: 'Participar da revisão final em relação ao que foi combinado.', outcome: 'Preparação da entrega e do lançamento.' },
    ],
  },
  en: {
    title: 'Process', opening: 'From the first conversation to delivery, every stage has a purpose.',
    stages: [
      { id: 1, title: 'Discovery and planning', explanation: 'I start by understanding the problem, your goals and who will use the solution. That conversation becomes a brief and a shared direction for the project.', participation: 'Share context, goals and expectations.', outcome: 'A brief and an agreed direction for the work.' },
      { id: 2, title: 'Development and collaboration', explanation: 'I turn that direction into a solution that evolves throughout the project. You follow its progress and help shape adjustments through feedback.', participation: 'Follow progress and share feedback.', outcome: 'An evolving solution and adjustments during development.' },
      { id: 3, title: 'Finalization and launch', explanation: 'We review the result against what we agreed, complete the adjustments and prepare delivery for the people who will use the solution.', participation: 'Take part in the final review against the agreed direction.', outcome: 'Preparation for delivery and launch.' },
    ],
  },
};
