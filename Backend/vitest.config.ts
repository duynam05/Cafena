import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /@nestjs\/common\/interfaces\.js$/,
        replacement: '@nestjs/common/interfaces/index.js',
      },
    ],
  },
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
  },
});
