import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  envDir: '.env',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  base: '/',
  server: {
    port: 3333,
    open: true
  }
})