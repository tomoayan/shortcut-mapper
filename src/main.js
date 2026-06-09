import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;
if (isTauri) {
    console.log("Running on Tauri Window!");
    console.log("IndexedDB saved at: C:\\Users\\<YourUsername>\\AppData\\Local\\com.tomoayan.shortcutmapper\\EBWebView\\Default\\IndexedDB");
}

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
