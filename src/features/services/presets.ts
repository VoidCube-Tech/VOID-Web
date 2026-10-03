import type { PagePresentation, ServicePreset } from './types';
const base: PagePresentation = {
  layout: 'standard', hero: { type: 'minimal' }, modules: { type: 'grid' }, results: { type: 'editorial' }, sections: {},
  order: ['problem', 'solution', 'features', 'modules', 'integrations', 'results', 'metrics', 'media', 'process', 'customization', 'pricing'],
};
export const servicePagePresets: Record<ServicePreset, PagePresentation> = {
  default: base,
  'cinematic-concept': {
    ...base, layout: 'cinematic', hero: { type: 'concept' },
    sections: {
      problem: { type: 'concept', scene: 'focus' },
      solution: { type: 'concept', scene: 'build' },
      features: { type: 'concept', scene: 'responsive' },
      process: { type: 'process' },
    },
  },
};
