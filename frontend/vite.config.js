import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import React from 'react'
// vite.config.js
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Add this line
    port: 5173
  }
})