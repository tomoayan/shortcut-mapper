// import Fuse from 'fuse.js'
import Fuse from '../../public/vendor/fuse.min.js'
import { lastKeyPress, shortcutList, softwareList, keyboardActiveKeys } from '../data.js'

let shortcutListLocal = [];

shortcutList.subscribe((callback) => {
    let shortcutListTemp = [];
    for (const [key, val] of Object.entries(callback.softwares)) {
        for (const shortcut of val.shortcuts) {
            shortcutListTemp.push({
                name: shortcut.usecase,
                description: shortcut.extrainfo,
                softwareName: key,
                icon: val.icon,
                shortcut: shortcut.shortcut
            })
        }
    }
    shortcutListLocal = shortcutListTemp;
})




export const shortcutFilter = (activeKeys, options) => {
    activeKeys = Array.isArray(activeKeys) ? activeKeys : keyboardActiveKeys.value;
    const t1 = performance.now()


    // filter
    let result = null;
    (() => {
        if (activeKeys.length === 0) {
            result = shortcutListLocal;
            return;
        }

        let filteredShortcut = [];
        for (const shortcut of shortcutListLocal) {
            const isActiveShortcutFound = shortcut.shortcut.split('⌨').every((val) => activeKeys.includes(val));
            if (isActiveShortcutFound) filteredShortcut.push(shortcut)
        }
        result = filteredShortcut;
    })();

    if (options?.searchInput) {
        const fuseOptions = {
            isCaseSensitive: false,
            ignoreDiacritics: true,
            findAllMatches: true,
            threshold: .5,
            keys: [
                'name',
            ]
        };
        if (options.searchFilterIncludeDescription) fuseOptions.keys.push('description');
        if (options.searchFilterCaseSensitive) {
            fuseOptions.isCaseSensitive = true;
            fuseOptions.ignoreDiacritics = false;
            fuseOptions.threshold = 0;
        }


        console.log(fuseOptions);
        console.log(options.searchInput);

        const fuse = new Fuse(result, fuseOptions);
        result = fuse.search(options.searchInput).map(res => res.item);
    }


    const t2 = performance.now()
    console.log(t2 - t1)
    return result
}