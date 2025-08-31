import { shortcutList, keyboardActiveKeys, keyboardIsPause, keyboardKeyDomListRaw, keyboardIsRawKeyInput } from "./modules/data.js"
import * as localStorageData from "./modules/localStorageManager.js"
import "./modules/sideBar/newSoftwareShortcut.js"
// import * as gdrive from "./drive.js";
// import './modules/shortcutExplorer/index.js'

let isLogin = true

addEventListener('DOMContentLoaded', async () => {

    // Event: Keydown
    setTimeout(() => {
        // debugger
        document.addEventListener('keydown', function (event) {
            if (keyboardIsPause.value) return

            const key = keyboardIsRawKeyInput.value ? event.code : event.key;
            let keyDomList = keyboardKeyDomListRaw;
            const activeKeyboardKeysTMP = keyboardActiveKeys.value;
            // console.log(event.code + "   " + event.key)

            try {
                if (!keyDomList[key]) {
                    console.error(`"${key}" ${keyboardIsRawKeyInput.value ? "raw key" : ""} doesn't exist in virtual keyboard! If you think this is an unexpected behaviour, please report this on github issues`)
                }

                if (!activeKeyboardKeysTMP.includes(key)) {
                    // Key not active? activate it!
                    activeKeyboardKeysTMP.push(key);
                    keyboardActiveKeys.set(activeKeyboardKeysTMP)
                    if (keyDomList[key]) for (const keyEl of keyDomList[key]) keyEl.classList.add("active");
                } else {
                    // Key is active? deactivate it!
                    const keyIndex = activeKeyboardKeysTMP.indexOf(key);
                    activeKeyboardKeysTMP.splice(keyIndex, 1);
                    keyboardActiveKeys.set(activeKeyboardKeysTMP)
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
    // console.warn('activeKeyboardKeys started')
    const sortStartTime = performance.now();

    shortcutDeleteController.abort() // remove previous events

    // utils
    let activeKeys = keyboardActiveKeys.value;
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



    let softwareList = document.querySelector('.content-wrapper > .shortcut-explorer-wrapper > .side-panel > ul.software-list');
    softwareList.innerHTML = ""
    for (const [key, val] of Object.entries(shortcutList.value.softwares)) {
        const softwareElHtmlString = `<li data-software="${key}">
                                        <span>
                                            <img src="${val.icon}" alt="${key}">
                                            ${key}
                                        </span>
                                        <div class="option-wrapper">
                                            <span class="" data-software-name="${key}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-ellipsis-icon lucide-circle-ellipsis"><circle cx="12" cy="12" r="10"/><path d="M17 12h.01"/><path d="M12 12h.01"/><path d="M7 12h.01"/></svg>
                                            </span>
                                            <span class="" data-software-name="${key}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-plus-icon lucide-folder-plus"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
                                            </span>
                                            <span class="remove-icon" title="tmp remove shortcut icon" data-software-name="${key}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                            </span>
                                            <span class="total">0</span>
                                        </div>
                                    </li>`
        let li = parser.parseFromString(softwareElHtmlString, 'text/html')
        softwareList.append(li.body.firstChild)
    }
    document.querySelectorAll('.content-wrapper > .shortcut-explorer-wrapper > .side-panel > ul.software-list > li .remove-icon').forEach((el) => {
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




    let shortcutListDOM = document.querySelector('.content-wrapper > .shortcut-explorer-wrapper > .explorer > ul.shortcut-list');
    shortcutListDOM.innerHTML = "" // remove existing


    for (const sCut of activeShortcutList) {
        const softwareCountEl = document.querySelector(`.content-wrapper > .shortcut-explorer-wrapper > .side-panel > ul.software-list > li[data-software="${sCut.software}"] span.total`);
        if (softwareCountEl) softwareCountEl.innerText = Number(softwareCountEl.innerText) + 1

        const shortcutElHtmlString = `<li>
                                <div class="title-wrapper">
                                <div class="title">
                                        <img src="${sCut.icon}" alt="${sCut.software}" title="${sCut.software}">
                                        <strong>${sCut.usecase}</strong>
                                        <span class="active-keys"></span>
                                    </div>
                                    <div class="options-wrapper">
                                        <span title="Pin" data-shortcut="${sCut.shortcut}" data-software-name="${sCut.software}">
                                            <span>    
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                                        </span>
                                        <span title="Edit" data-shortcut="${sCut.shortcut}" data-software-name="${sCut.software}">
                                            <span>
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                        </span>
                                        <span title="Move" data-shortcut="${sCut.shortcut}" data-software-name="${sCut.software}">
                                            <span>
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-symlink-icon lucide-folder-symlink"><path d="M2 9.35V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7"/><path d="m8 16 3-3-3-3"/></svg>
                                        </span>
                                        <span class="remove-icon" title="Delete" data-shortcut="${sCut.shortcut}" data-software-name="${sCut.software}">
                                            <span>    
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </span>
                                    </div>
                                </div>
                                ${sCut.extrainfo ? `<p class="extra-info">${sCut.extrainfo}</p>` : ""}
                                </li>`
        let li = parser.parseFromString(shortcutElHtmlString, 'text/html')

        li.body.firstChild.addEventListener('mouseenter', (e) => {
            const localAbortController = new AbortController();

            const initOptionsActivation = setTimeout(() => {
                    e.target.classList.add('active')
                    e.target.dataset.animating = true;
                    setTimeout(() => {
                        e.target.dataset.animating = false;
                    }, 400);
                }, 500);

            e.target.addEventListener('mouseleave', (ev) => {
                clearTimeout(initOptionsActivation)
                const intervalId = setInterval(() => {
                    if (ev.target.dataset.animating === undefined) return clearInterval(intervalId);

                    const animating = ev.target.dataset.animating === "true" ? true : false;
                    if (!animating && !ev.target.querySelector('.options-wrapper').classList.contains('active')) {
                        clearInterval(intervalId)
                        ev.target.classList.remove('active');
                        ev.target.removeAttribute('data-animating');
                        localAbortController.abort()
                    }
                }, 100);
            }, { signal: localAbortController.signal })
        })

        li.body.firstChild.querySelector(`.active-keys`).innerHTML = ''
        sCut.shortcut.split('⌨').forEach((s) => {
            const newEl = document.createElement('span');
            newEl.innerText = s;
            li.body.firstChild.querySelector(`.active-keys`).append(newEl);
        })

        li.body.querySelectorAll('.options-wrapper > span').forEach((el) => {
            el.addEventListener('click', (e) => e.currentTarget.classList.toggle('active'))
        })

        shortcutListDOM.append(li.body.firstChild)
    }

    document.querySelectorAll('.content-wrapper > .shortcut-explorer-wrapper > .explorer > ul.shortcut-list > li .remove-icon').forEach((el) => {
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
    document.querySelector('.content-wrapper > .shortcut-explorer-wrapper > .explorer > .nav > .info-heading .results-timing').innerHTML = `Results in ${sortEndTime - sortStartTime}ms`
    document.querySelector('.content-wrapper > .shortcut-explorer-wrapper > .explorer > .nav .active-shortcut-list').innerHTML = `${keyboardActiveKeys.value.map((e) => '<span>' + e + '</span>').join("")}`
    // console.warn('activeKeyboardKeys ended')
}


keyboardActiveKeys.subscribe(sortActiveShortcutSoftware)
shortcutList.subscribe(sortActiveShortcutSoftware)