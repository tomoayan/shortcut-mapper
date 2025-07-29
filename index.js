import { shortcutList, activeKeyboardKeys, isKeyboardPause } from "./modules/data.js"
import * as localStorageData from "./modules/localStorageManager.js"
import * as keyboardManager from "./modules/nav/keyboardManager.js"
import "./modules/nav/newSoftwareShortcut.js"
// import * as gdrive from "./drive.js";

let isLogin = true
// let activeKeys = []
let keyDomList = keyboardManager.keyDomList


addEventListener('DOMContentLoaded', async () => {

    // Event: Keydown
    setTimeout(() => {
        document.addEventListener('keydown', function (event) {
            if (isKeyboardPause.value) return
            const key = event.key;
            const activeKeyboardKeysTMP = activeKeyboardKeys.value;

            try {
                if (!keyDomList[key]) {
                    return console.error(`"${key}" doesn't exist in virtual keyboard! If you think this is an unexpected behaviour, please report this on github issues`)
                }

                if (!activeKeyboardKeysTMP.includes(key)) {
                    // Key not active, so activate it!
                    activeKeyboardKeysTMP.push(key);
                    activeKeyboardKeys.set(activeKeyboardKeysTMP)
                    keyDomList[key].classList.add("active");
                } else {
                    const keyIndex = activeKeyboardKeysTMP.indexOf(key);
                    activeKeyboardKeysTMP.splice(keyIndex, 1);
                    activeKeyboardKeys.set(activeKeyboardKeysTMP)
                    keyDomList[key].classList.remove("active");
                }
            } catch (e) {
                console.error('error on keypress')
                console.log(e)
            }
        });
    }, 500);

    await localStorageData.init();
})







const sortActiveShortcutSoftware = () => {
    console.warn('activeKeyboardKeys started')

    // utils
    let activeKeys = activeKeyboardKeys.value;
    let activeShortcutList = [];
    let parser = new DOMParser();
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



    let softwareList = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.software-list > li');
    for (let index = 2; index < softwareList.length; index++) softwareList[index].remove(); // remove exsiting
    for (const [key, val] of Object.entries(shortcutList.value.softwares)) {
        const softwareElHtmlString = `<li data-software="${key}">
                                        <span>
                                            <img src="${val.icon}" alt="${key}">
                                            ${key}
                                        </span>
                                        <span class="total">0</span>
                                    </li>`
        // console.log(softwareElHtmlString)
        let li = parser.parseFromString(softwareElHtmlString, 'text/html')
        softwareList[1].after(li.body.firstChild)
    }



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
            activeShortcutList.push({
                software: softwareName,
                icon: softwareIcon,
                shortcut: shortcut.shortcut,
                usecase: shortcut.usecase,
                extrainfo: shortcut.extrainfo
            })
        });
    }




    let shortcutListDOM = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.shortcut-list > li');
    for (let index = 1; index < shortcutListDOM.length; index++) shortcutListDOM[index].remove(); // remove existing


    for (const sCut of activeShortcutList) {
        const softwareCountEl = document.querySelector(`.content-wrapper > .shortcut-wrapper > ul.software-list > li[data-software="${sCut.software}"] > span.total`);
        if (softwareCountEl) softwareCountEl.innerText = Number(softwareCountEl.innerText) + 1


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
        shortcutListDOM[0].after(li.body.firstChild)
    }

    console.warn('activeKeyboardKeys ended')
}


activeKeyboardKeys.subscribe(sortActiveShortcutSoftware)
shortcutList.subscribe(sortActiveShortcutSoftware)