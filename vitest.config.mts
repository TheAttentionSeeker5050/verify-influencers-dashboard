import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// This is a sample test
// Here is the documentation sources:
// https://nextjs.org/docs/app/building-your-application/testing/vitest
// https://vitest.dev/guide/

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
  },
})