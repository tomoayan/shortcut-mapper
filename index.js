import { shortcutList, activeKeyboardKeys, isKeyboardPause, keyDomListRaw, isRawKeyInput } from "./modules/data.js"
import * as localStorageData from "./modules/localStorageManager.js"
import "./modules/nav/newSoftwareShortcut.js"
// import * as gdrive from "./drive.js";

let isLogin = true

addEventListener('DOMContentLoaded', async () => {

    // Event: Keydown
    setTimeout(() => {
        document.addEventListener('keydown', function (event) {
            if (isKeyboardPause.value) return

            const key = isRawKeyInput.value ? event.code : event.key;
            let keyDomList = keyDomListRaw;
            const activeKeyboardKeysTMP = activeKeyboardKeys.value;
            // console.log(event.code + "   " + event.key)

            try {
                if (!keyDomList[key]) {
                    console.error(`"${key}" ${isRawKeyInput.value ? "raw key" : ""} doesn't exist in virtual keyboard! If you think this is an unexpected behaviour, please report this on github issues`)
                }

                if (!activeKeyboardKeysTMP.includes(key)) {
                    // Key not active? activate it!
                    activeKeyboardKeysTMP.push(key);
                    activeKeyboardKeys.set(activeKeyboardKeysTMP)
                    if (keyDomList[key]) for (const keyEl of keyDomList[key]) keyEl.classList.add("active");
                } else {
                    // Key is active? deactivate it!
                    const keyIndex = activeKeyboardKeysTMP.indexOf(key);
                    activeKeyboardKeysTMP.splice(keyIndex, 1);
                    activeKeyboardKeys.set(activeKeyboardKeysTMP)
                    if (keyDomList[key]) for (const keyEl of keyDomList[key]) keyEl.classList.remove("active");
                }
            } catch (e) {
                console.error('error on keypress')
                console.log(e)
            }
        });
    }, 500);

    await localStorageData.init();
})





const shortcutDeleteController = new AbortController() // tmp way to remove unsed events

const sortActiveShortcutSoftware = () => {
    console.warn('activeKeyboardKeys started')
    const sortStartTime = performance.now();

    shortcutDeleteController.abort() // remove previous events

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
                                        <div class="option-wrapper">
                                            <span class="remove-icon" title="tmp remove shortcut icon" data-software-name="${key}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                            </span>
                                            <span class="total">0</span>
                                        </div>
                                    </li>`
        let li = parser.parseFromString(softwareElHtmlString, 'text/html')
        softwareList[1].after(li.body.firstChild)
    }
    document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.software-list > li .remove-icon').forEach((el) => {
        el.addEventListener('click', (e) => {
            const softwareName = e.currentTarget.dataset.softwareName;
            try {
                localStorageData.removeSoftware(softwareName)
            } catch (err) {
                console.warn('unable to remove software')
                console.error(err)
            }
        })
    })



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
        const softwareCountEl = document.querySelector(`.content-wrapper > .shortcut-wrapper > ul.software-list > li[data-software="${sCut.software}"] span.total`);
        console.log(softwareCountEl)
        if (softwareCountEl) softwareCountEl.innerText = Number(softwareCountEl.innerText) + 1


        const shortcutElHtmlString = `<li>
                                <div class="title-wrapper">
                                    <img src="${sCut.icon}" alt="${sCut.software}" title="${sCut.software}">
                                    <div class="title">
                                        <strong>${sCut.usecase}</strong>
                                        <span class="item-count">${sCut.shortcut.replace('⌨', ' + ')}</span>
                                        </div>
                                        <span class="remove-icon" title="tmp remove shortcut icon" data-shortcut="${sCut.shortcut}" data-software-name="${sCut.software}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </span>
                                </div>
                                <p class="extra-info">${sCut.extrainfo}</p>
                            </li>`
        let li = parser.parseFromString(shortcutElHtmlString, 'text/html')
        shortcutListDOM[0].after(li.body.firstChild)
    }

    document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.shortcut-list > li .remove-icon').forEach((el) => {
        el.addEventListener('click', async (e) => {
            const softwareName = e.currentTarget.dataset.softwareName;
            const shortcut = e.currentTarget.dataset.shortcut;
            try {
                localStorageData.removeShortcut(softwareName, shortcut)
            } catch (err) {
                console.warn('unable to remove shortcut')
                console.error(err)
            }
        })
    }, { signal: shortcutDeleteController.signal })

    const sortEndTime = performance.now();
    document.querySelector('.shortcut-list .info-heading .results-timing').innerHTML = `Results in ${sortEndTime - sortStartTime}ms`
    document.querySelector('.shortcut-list .info-heading .active-shortcut-list').innerHTML = `${activeKeyboardKeys.value.map((e) => '<span>' + e + '</span>').join("")}`
    console.warn('activeKeyboardKeys ended')
}


activeKeyboardKeys.subscribe(sortActiveShortcutSoftware)
shortcutList.subscribe(sortActiveShortcutSoftware)