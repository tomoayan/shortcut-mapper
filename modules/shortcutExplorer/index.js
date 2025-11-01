import Fuse from 'fuse.js';
import { shortcutFilter } from './shortcutFilter.js'
import { lastKeyPress, shortcutList, softwareList, keyboardActiveKeys, searchInputParams } from '../data.js'
import { showShortcuts } from './ui-handler.js'


const shortcutListSection = (callback, options) => {
    showShortcuts(shortcutFilter(callback, options))
}


shortcutList.subscribe((callback) => {
    shortcutListSection(keyboardActiveKeys.value);
})

keyboardActiveKeys.subscribe((callback) => {
    shortcutListSection(callback, searchInputParams.value);
})

searchInputParams.subscribe((callback) => {
    shortcutListSection(keyboardActiveKeys.value, callback);
})