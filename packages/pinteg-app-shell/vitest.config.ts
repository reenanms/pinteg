import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['tst/**/*.{test,spec}.{ts,tsx}'],
        alias: {
            'pinteg-react': path.resolve(__dirname, '../pinteg-react/src/index.ts'),
            'pinteg-data-source': path.resolve(__dirname, '../pinteg-data-source/src/index.ts'),
            'pinteg-theme-react': path.resolve(__dirname, '../pinteg-theme-react/src/index.ts'),
            'pinteg-core': path.resolve(__dirname, '../pinteg-core/src/index.ts'),
            'pinteg-crud-react': path.resolve(__dirname, '../pinteg-crud-react/src/index.ts'),
            'pinteg-app-shell': path.resolve(__dirname, './src/index.ts')
        }
    }
});
