import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        include: ['tst/**/*.{test,spec}.{ts,tsx}'],
    },
});
