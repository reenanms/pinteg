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
            'pinteg-react': path.resolve(__dirname, '../../packages/pinteg-react/src'),
            'pinteg-crud-react': path.resolve(__dirname, '../../packages/pinteg-crud-react/src'),
            'pinteg-data-source': path.resolve(__dirname, '../../packages/pinteg-data-source/src'),
            'pinteg-theme-react': path.resolve(__dirname, '../../packages/pinteg-theme-react/src'),
            'pinteg-app-shell': path.resolve(__dirname, '../../packages/pinteg-app-shell/src'),
        }
    },
    server: {
        port: 3001,
        open: true
    }
});
