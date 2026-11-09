import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/** Used only at build time (scripts/prerender.mjs) to put the full page text into index.html. */
export const render = () => renderToString(<App />);
