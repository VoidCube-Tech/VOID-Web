import type { PagePresentation, ServicePreset } from './types';
const base: PagePresentation = {
  pricingPlacement: 'section', layout: 'standard', hero: { type: 'minimal' }, modules: { type: 'grid' }, results: { type: 'editorial' }, sections: {},
  order: ['problem', 'solution', 'features', 'modules', 'integrations', 'results', 'metrics', 'media', 'process', 'customization', 'pricing'],
};
export const servicePagePresets: Record<ServicePreset, PagePresentation> = {
  default: base,
  'live-platform': {
    ...base, layout: 'live-product', hero: { type: 'live-event' },
    order: ['problem', 'solution', 'features', 'results', 'process', 'integrations', 'pricing'],
    sections: {
      problem: { type: 'message-band', variant: 'conversation' },
      solution: { type: 'editorial-list' },
      features: { type: 'event-connections' },
      results: { type: 'editorial-list' },
      process: { type: 'capacity-demo' },
      integrations: { type: 'operational-summary' },
    },
  },
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
