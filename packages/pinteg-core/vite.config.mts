import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tst/**/*.{test,spec}.{ts,tsx}']
    }
});
