import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ⚠️ IMPORTANTE PARA GITHUB PAGES
// Si tu repo se llama "laura-rompecabezas", la URL final es:
//   https://TU-USUARIO.github.io/laura-rompecabezas/
// y `base` DEBE ser '/laura-rompecabezas/' (con las dos barras).
//
// Si algún día lo publicas en un dominio propio (o en Vercel/Netlify),
// cambia base a '/'.
const BASE = '/laura-rompecabezas/'

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss()],
})
