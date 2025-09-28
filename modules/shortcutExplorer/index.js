import Fuse from 'fuse.js';
import { shortcutFilter } from './shortcutFilter.js'
import { lastKeyPress, shortcutList, softwareList, keyboardActiveKeys } from '../data.js'



const shortcutListSection = (callback) => {


console.log(shortcutFilter(callback));

}

keyboardActiveKeys.subscribe(shortcutListSection)