import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'path';
import {defineConfig} from 'vite';

const staticWorkerSource = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || url.pathname.includes(".")) {
      return response;
    }

    const fallbackUrl = new URL("/index.html", request.url);
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};
`;

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'sites-static-worker',
        async closeBundle() {
          const serverDirectory = path.resolve(__dirname, 'dist/server');
          await mkdir(serverDirectory, {recursive: true});
          await writeFile(
            path.join(serverDirectory, 'index.js'),
            staticWorkerSource,
            'utf8',
          );
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
