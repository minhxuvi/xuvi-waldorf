import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({ plugins:[react()], root:path.resolve(import.meta.dirname,'.'), build:{outDir:path.resolve(import.meta.dirname,'dist')}, server:{port:5173,host:'127.0.0.1',proxy:{'/api':'http://127.0.0.1:5174','/files':'http://127.0.0.1:5174'}} });
