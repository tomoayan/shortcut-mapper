import { writable, get } from 'svelte/store';
import { dbApi } from './db.js';

export const softwareList = writable([]);
export const activeSoftwareId = writable(null);
export const searchInput = writable('');
export const searchResults = writable([]);
export const softwareCounts = writable({});
export const searchQueryTime = writable(0);
export const searchIsCaseSensitive = writable(false);
export const searchIncludeDescription = writable(true);
export const isSearchVisible = writable(true);

export const editingSoftwareData = writable(null);
export const editingShortcutData = writable(null);

// Keyboard stores
export const keyboardActiveKeys = writable([]);
export const keyboardIsPause = writable(false);
export const keyboardIsRawKeyInput = writable(false);
export const keyboardLayout = writable('generic');

let activeIconUrls = [];

export async function loadSoftware() {
    const list = await dbApi.getSoftware();

    // Revoke old object URLs to prevent memory leaks
    for (const url of activeIconUrls) {
        URL.revokeObjectURL(url);
    }
    activeIconUrls = [];

    const allShortcuts = await dbApi.getShortcuts(null, '', [], false, false);
    for (const sw of list) {
        if (sw.iconId) {
            const blob = await dbApi.getImage(sw.iconId);
            if (blob) {
                sw.iconUrl = URL.createObjectURL(blob);
                activeIconUrls.push(sw.iconUrl);
            }
        }
        const swShortcuts = allShortcuts.filter(s => s.software_id === sw.id);
        const pagesSet = new Set(swShortcuts.map(s => s.page).filter(Boolean));
        sw.pages = Array.from(pagesSet).sort();
    }

    softwareList.set(list);
}

export async function loadShortcuts() {
    const t0 = performance.now();
    const swId = get(activeSoftwareId);
    const query = get(searchInput);
    const activeKeys = get(keyboardActiveKeys);
    const caseSensitive = get(searchIsCaseSensitive);
    const includeDesc = get(searchIncludeDescription);

    // Load main results
    const results = await dbApi.getShortcuts(swId, query, activeKeys, caseSensitive, includeDesc);
    searchResults.set(results);

    // Load counts globally (null swId) to update sidebar
    const allResults = await dbApi.getShortcuts(null, query, activeKeys, caseSensitive, includeDesc);
    const counts = {};
    for (const r of allResults) {
        if (!counts[r.software_id]) {
            counts[r.software_id] = { total: 0, pages: {} };
        }
        counts[r.software_id].total += 1;
        if (r.page) {
            counts[r.software_id].pages[r.page] = (counts[r.software_id].pages[r.page] || 0) + 1;
        }
    }
    softwareCounts.set(counts);

    searchQueryTime.set(performance.now() - t0);
}
