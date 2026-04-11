import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['tst/**/*.{test,spec}.{ts,tsx}']
    }
});
