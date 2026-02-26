import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './{app,components,lib}/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Add any custom theme extensions here
    },
  },
  plugins: [],
};

export default config;
