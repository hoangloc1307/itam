import { type Config } from 'prettier';

const prettierConfig: Config = {
  printWidth: 100,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'crlf',
  bracketSameLine: false,
  jsxSingleQuote: true,
  proseWrap: 'preserve',
  plugins: ['prettier-plugin-tailwindcss'],
};

export default prettierConfig;
