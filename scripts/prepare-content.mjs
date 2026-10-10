import { readContent, writeIndexAndFeed } from './content.mjs';
const bundle = readContent();
writeIndexAndFeed(bundle);
console.log(`Prepared issue index and RSS for ${bundle.issues.length} issue(s).`);
