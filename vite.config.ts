import { defineConfig } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readContent, writeIndexAndFeed } from './scripts/content.mjs';
import App from './src/App';
import type { ContentBundle } from './src/types';

export default defineConfig(() => {
  const bundle = readContent() as ContentBundle;
  const feed = writeIndexAndFeed(bundle);
  const data = JSON.stringify(bundle).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return {
    base: './',
    build: { target: 'es2022', sourcemap: false },
    plugins: [{
      name: 'embed-the-paper',
      transformIndexHtml(html) {
        return html.replace('<!--paper-->', renderToString(createElement(App, { bundle })))
          .replace('<!--issue-data-->', `<script type="application/json" id="issue-data">${data}</script>`);
      },
      generateBundle() { this.emitFile({ type: 'asset', fileName: 'feed.xml', source: feed }); },
    }],
  };
});
