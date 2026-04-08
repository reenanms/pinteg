import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'pinteg-core': path.resolve(__dirname, '../../packages/pinteg-core/src'),
            'pinteg-react': path.resolve(__dirname, '../../packages/pinteg-react/src')
        }
    },
    server: {
        port: 3000,
        open: true
    }
});
