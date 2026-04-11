import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
    plugins: [
        react(),
        cssInjectedByJsPlugin()
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'pinteg',
            formats: ['es'],
            fileName: 'pinteg'
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', 'pinteg-core'],

            output: {
                preserveModules: false,
                inlineDynamicImports: false
            }
        }
    },
    // @ts-ignore
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['tst/**/*.{test,spec}.{ts,tsx}']
    }
});
