import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { execSync } from 'child_process'

let commitHash = 'dev';
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  console.warn('Could not get git commit hash');
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
  ],
  define: {
    '__COMMIT_HASH__': JSON.stringify(commitHash)
  }
})
