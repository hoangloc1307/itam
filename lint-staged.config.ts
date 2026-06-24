import type { Configuration } from 'lint-staged';

const lintStagedConfig: Configuration = {
  'fe/**/*.{js,jsx,ts,tsx,cjs,mjs}': ['pnpm -C fe eslint --fix'],
  'be/**/*.{js,jsx,ts,tsx,cjs,mjs}': ['pnpm -C be eslint --fix'],
  '*.{js,jsx,ts,tsx,cjs,mjs,json,md,html,css,scss}': ['prettier --write'],
};

export default lintStagedConfig;
