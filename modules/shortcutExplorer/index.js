import { shortcutFilter } from './shortcutFilter.js'
import { lastKeyPress, shortcutList, softwareList, keyboardActiveKeys } from '../data.js'



const shortcutListSection = (callback) => {
// console.log('filter started')

// console.log(shortcutFilter(callback));
shortcutFilter(callback)

}

keyboardActiveKeys.subscribe(shortcutListSection)
// shortcutList.subscribe(shortcutListSection)