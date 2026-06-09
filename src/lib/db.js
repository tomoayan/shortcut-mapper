import localforage from 'localforage';
import Fuse from 'fuse.js';
import { v4 as uuidv4 } from 'uuid';
import { writable } from 'svelte/store';

export const isDbReady = writable(true);

localforage.config({
  name: 'ShortcutMapperDB'
});

async function getSoftware() {
  const data = await localforage.getItem('software') || [];
  return data;
}

async function addSoftware(name, iconBlob) {
  const data = await getSoftware();
  const id = uuidv4();
  let iconId = null;
  
  if (iconBlob) {
      iconId = `img-${uuidv4()}`;
      await localforage.setItem(iconId, iconBlob);
  }
  
  data.push({ id, name, iconId });
  await localforage.setItem('software', data);
  return { success: true, id };
}

async function removeSoftware(id) {
  const swData = await getSoftware();
  const sw = swData.find(s => s.id === id);
  if (sw && sw.iconId) {
      await localforage.removeItem(sw.iconId);
  }
  await localforage.setItem('software', swData.filter(s => s.id !== id));
  
  const scData = await getAllShortcuts();
  await localforage.setItem('shortcuts', scData.filter(s => s.software_id !== id));
  return { success: true };
}

async function getImage(iconId) {
  if (!iconId) return null;
  return await localforage.getItem(iconId);
}

async function getAllShortcuts() {
  return await localforage.getItem('shortcuts') || [];
}

async function getShortcuts(software_id, query, activeKeys, caseSensitive, includeDesc) {
  let data = await getAllShortcuts();
  
  if (software_id) {
    data = data.filter(s => s.software_id === software_id);
  }
  
  if (query) {
    const keys = ['usecase', 'shortcut'];
    if (includeDesc) keys.push('extrainfo');
    
    // fuse.js defaults to case-insensitive.
    // If caseSensitive is requested, we can use exact matching or post-filter.
    // We'll configure Fuse for fuzzy searching but if caseSensitive is true we use JS post-filtering.
    if (caseSensitive) {
        data = data.filter(shortcut => {
            if (shortcut.usecase && shortcut.usecase.includes(query)) return true;
            if (includeDesc && shortcut.extrainfo && shortcut.extrainfo.includes(query)) return true;
            return false;
        });
    } else {
        const fuse = new Fuse(data, {
            keys,
            threshold: 0.3,
            ignoreLocation: true,
            isCaseSensitive: false
        });
        data = fuse.search(query).map(result => result.item);
    }
  }
  
  if (activeKeys && activeKeys.length > 0) {
    data = data.filter(shortcut => {
      const keys = shortcut.shortcut.split('⌨');
      return keys.every(k => activeKeys.includes(k));
    });
  }
  
  return data;
}

async function addShortcut(software_id, usecase, shortcut, extrainfo, page) {
  const data = await getAllShortcuts();
  const id = uuidv4();
  data.push({ id, software_id, usecase, shortcut, extrainfo, page });
  await localforage.setItem('shortcuts', data);
  return { success: true, id };
}

async function removeShortcut(id) {
  const data = await getAllShortcuts();
  await localforage.setItem('shortcuts', data.filter(s => s.id !== id));
  return { success: true };
}

export const dbApi = {
  getSoftware,
  getShortcuts,
  addSoftware,
  addShortcut,
  removeSoftware,
  removeShortcut,
  getImage
};
