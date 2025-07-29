// 
// 
// 
// THIS FILE **MOSTLY** CONTAIN SHORTCUT LIST RELATED CODE
// 
// 
// 

import { shortcutList, activeKeyboardKeys, activeShortcutList } from "./modules/data.js"
import * as localStorageData from "./modules/localStorageManager.js"
import * as keyboardManager from "./modules/nav/keyboardManager.js"
import "./modules/nav/newSoftwareShortcut.js"
// import * as gdrive from "./drive.js";

let isLogin = true
// let activeKeys = []
let keyDomList = keyboardManager.keyDomList
// const shortcutsListReadonly = shortcutList



addEventListener('DOMContentLoaded', async () => {

    // Event: Keydown
    setTimeout(() => {
        document.addEventListener('keydown', function (event) {
            const key = event.key;
            const activeKeys = activeKeyboardKeys.value;

            try {
                if (!activeKeys.includes(key)) {
                    // Key not active, so activate it!
                    activeKeys.push(key);
                    activeKeyboardKeys.set(activeKeys)
                    keyDomList[key].classList.add("active");
                } else {
                    const keyIndex = activeKeys.indexOf(key);
                    activeKeys.splice(keyIndex, 1);
                    activeKeyboardKeys.set(activeKeys)
                    keyDomList[key].classList.remove("active");
                }
                // sortActiveShortcutSoftwares()
            } catch (e) {
                const keyList = Object.keys(keyDomList)
                if (keyList.includes(e.key)) {
                    console.warn(key + " - key is availble the the virtual keyboard list, error is somewhere else")
                } else {
                    // console.clear()
                    // console.log(key)
                    console.error(key + " - key is not availble on the virtual keyboard. Please report this on github issues")
                }
                console.log(e)
            }
        });
    }, 500);

    await localStorageData.init();
})







const sortActiveShortcutSoftwares = () => {
    console.log('activeKeyboardKeys')

    const isAvtiveShortcutMatched = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return false;
        }

        // Sort both arrs
        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();

        // If not matched, return false
        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i]) return false;
        };

        return true
    }

    let activeKeys = activeKeyboardKeys.value
    let activeShortcutListTMP = [];

    for (const [softwareName, softwareValue] of Object.entries(shortcutList.value.softwares)) {
        let filteredShortcuts;
        if (activeKeys.length === 0) {
            filteredShortcuts = softwareValue.shortcuts;
        } else {
            filteredShortcuts = softwareValue.shortcuts
                .filter((sCut) => isAvtiveShortcutMatched(sCut.shortcut.split('⌨'), activeKeys));
        }

        if (filteredShortcuts.length === 0) continue

        const softwareIcon = softwareValue.icon;
        filteredShortcuts.forEach(shortcut => {
            activeShortcutListTMP.push({
                software: softwareName,
                icon: softwareIcon,
                shortcut: shortcut.shortcut,
                usecase: shortcut.usecase,
                extrainfo: shortcut.extrainfo
            })
        });
    }

    activeShortcutList.set(activeShortcutListTMP)
}




activeKeyboardKeys.subscribe(sortActiveShortcutSoftwares)
shortcutList.subscribe(sortActiveShortcutSoftwares)





activeShortcutList.subscribe((newVal) => {
    console.log(newVal)

    let softwareList = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.software-list > li');
    let shortcutList = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.shortcut-list > li');

    // Remove existing items from list
    for (let index = 2; index < softwareList.length; index++) softwareList[index].remove();
    for (let index = 1; index < shortcutList.length; index++) shortcutList[index].remove();


    let parser = new DOMParser();
    let addedSoftwares = []


    newVal.forEach((sCut) => {
        if (!addedSoftwares.includes(sCut.software)) {
            const softwareElHtmlString = `<li data-software="${sCut.software}">
                                    <span>
                                        <img src="${sCut.icon}" alt="${sCut.software}">
                                        ${sCut.software}
                                    </span>
                                    <span class="total">1</span>
                                </li>`
            let li = parser.parseFromString(softwareElHtmlString, 'text/html')
            softwareList[1].after(li.body.firstChild)
            addedSoftwares.push(sCut.software)
        } else {
            const softwareCountEl = document.querySelector(`.content-wrapper > .shortcut-wrapper > ul.software-list > li[data-software="${sCut.software}"] > span.total`);
            softwareCountEl.innerText = Number(softwareCountEl.innerText) + 1
        }

        const shortcutElHtmlString = `<li>
                                <div class="title-wrapper">
                                    <img src="${sCut.icon}" alt="${sCut.software}" title="${sCut.software}">
                                    <div class="title">
                                        <strong>${sCut.usecase}</strong>
                                        <span class="item-count">${sCut.shortcut.replace('⌨', ' + ')}</span>
                                    </div>
                                </div>
                                <p class="extra-info">${sCut.extrainfo}</p>
                            </li>`
        let li = parser.parseFromString(shortcutElHtmlString, 'text/html')
        shortcutList[0].after(li.body.firstChild)
    })
})