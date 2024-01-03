import { startStimulusApp } from '@symfony/stimulus-bridge';

import type { Application } from '@hotwired/stimulus';

export const app: Application = startStimulusApp(
  require.context(
    '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
    true,
    /\.(j|t)sx?$/
  )
);
