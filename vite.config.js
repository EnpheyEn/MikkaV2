import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ทำให้เข้าถึงได้จาก IP ในวง LAN
    port: 5173,       // ระบุ port ที่ต้องการ (ค่าเริ่มต้นคือ 5173)
    proxy: {
      '/mk-member-api': {
        target: 'http://192.168.20.5', // ตั้งเป้าหมายของ API
        changeOrigin: true,  // เปลี่ยน Origin ให้เหมือนกับ target
        secure: false,       // ถ้าใช้ HTTPS ก็ปรับให้เหมาะสม
      },
    },
  },
})
