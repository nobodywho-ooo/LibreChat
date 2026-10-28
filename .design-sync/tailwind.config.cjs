// LibreChat's own client Tailwind config, plus the design-sync preview files as
// content, so classes used only by previews are compiled too.
const path = require('node:path');
const base = require('../client/tailwind.config.cjs');
const root = path.resolve(__dirname, '..');
module.exports = {
  ...base,
  content: [
    path.join(root, 'client/src/**/*.{js,jsx,ts,tsx}'),
    path.join(root, 'packages/client/src/**/*.{js,jsx,ts,tsx}'),
    path.join(__dirname, 'previews/**/*.tsx'),
  ],
};
