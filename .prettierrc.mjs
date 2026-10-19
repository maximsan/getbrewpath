/** @type {import('prettier').Config} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  singleQuote: true,
  printWidth: 100,
  tailwindFunctions: ['cn', 'clsx'],
  tailwindStylesheet: './src/app/globals.css',
};

export default config;
