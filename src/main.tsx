import { hydrateRoot } from 'react-dom/client';
import App from './App';
import type { ContentBundle } from './types';
import './styles.css';

const root = document.getElementById('root');
const data = document.getElementById('issue-data')?.textContent;
if (!root || !data) throw new Error('The paper’s embedded issue data is missing. Rebuild the static export.');
hydrateRoot(root, <App bundle={JSON.parse(data) as ContentBundle} />);
