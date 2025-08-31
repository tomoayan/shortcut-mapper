import { lastKeyPress, shortcutList, softwareList, keyboardActiveKeys } from '../data.js'

export const shortcutFilter = (activeKeys) => {
    activeKeys = Array.isArray(activeKeys) ? activeKeys : keyboardActiveKeys.value;
    const shortcutListMap = new Map()

    for (const [key, val] of Object.entries(shortcutList.value.softwares)) {
        for (const shortcut of val.shortcuts) {
            const shortcutInfo = [{
                usecase: shortcut.usecase,
                extrainfo: shortcut.extrainfo,
                software: key
            }]

            if (shortcutListMap.has(shortcut.shortcut)) {
                shortcutListMap.set(shortcut.shortcut, [...(shortcutListMap.get(shortcut.shortcut)), ...shortcutInfo])
                continue
            }
            shortcutListMap.set(shortcut.shortcut, shortcutInfo)
        }
    }




    const t1 = performance.now()
    const shortcutKeyMap = [];
    for (const [shortcutKey, value] of shortcutListMap) {
        shortcutKeyMap.push([shortcutKey, value])
    }


    // filter
    const result = shortcutKeyMap.filter((shortcut) => {
        const shortcutKeyArr = shortcut[0].split('⌨');
        return activeKeys.every((val) => shortcutKeyArr.includes(val))
    })

    const t2 = performance.now()
    console.log(t2 - t1)
    return result
}


