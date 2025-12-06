import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/cinemas': 'http://localhost:3000',
            '/movies': 'http://localhost:3000',
            '/showtimes': 'http://localhost:3000'
        }
    }
})
