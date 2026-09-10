import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true, // Esto habilita la línea y el archivo del CSS
  },
});