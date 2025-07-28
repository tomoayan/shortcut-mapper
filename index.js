// 
// 
// 
// THIS FILE **MOSTLY** CONTAIN SHORTCUT LIST RELATED CODE
// 
// 
// 



import * as localStorageData from "./modules/localStorageManager.js"
import * as keyboardManager from "./modules/nav/keyboardManager.js"
import "./modules/nav/newSoftwareShortcut.js"
// import * as gdrive from "./drive.js";
import './modules/data.js'

let isLogin = true
let activeKeys = []
let keyDomList = keyboardManager.keyDomList
const shortcutsListReadonly = localStorageData.shortcutsList



addEventListener('DOMContentLoaded', async () => {

    // Event: Keydown
    setTimeout(() => {
        document.addEventListener('keydown', function (event) {
            const key = event.key;
            try {
                if (!activeKeys.includes(key)) {
                    // Key not active, so activate it!
                    activeKeys.push(key);
                    keyDomList[key].classList.add("active");
                } else {
                    const keyIndex = activeKeys.indexOf(key);
                    activeKeys.splice(keyIndex, 1);
                    keyDomList[key].classList.remove("active");
                }
                sortActiveShortcutSoftwares()
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

    await localStorageData.update();
    sortActiveShortcutSoftwares()
})











const sortActiveShortcutSoftwares = async () => {
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
    let activeShortcutLists = [];
    const shortcutsList = shortcutsListReadonly.content;

    for (const softwareName in shortcutsList.softwares) {
        let filteredShortcuts;
        if (activeKeys.length === 0) {
            filteredShortcuts = shortcutsList.softwares[softwareName].shortcuts;
        } else {
            filteredShortcuts = shortcutsList.softwares[softwareName].shortcuts
                .filter((sCut) => isAvtiveShortcutMatched(sCut.shortcut.split('⌨'), activeKeys));
        }

        if (filteredShortcuts.length === 0) continue

        const softwareIcon = shortcutsList.softwares[softwareName].icon;
        filteredShortcuts.forEach(shortcut => {
            activeShortcutLists.push({
                software: softwareName,
                icon: softwareIcon,
                shortcut: shortcut.shortcut,
                usecase: shortcut.usecase,
                extrainfo: shortcut.extrainfo
            })
        });
    }


    refreshShortcutSoftwareList(activeShortcutLists);
}





const refreshShortcutSoftwareList = (activeShortcutList) => {
    let softwareList = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.software-list > li');
    let shortcutList = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.shortcut-list > li');

    // Remove existing items from list
    for (let index = 2; index < softwareList.length; index++) softwareList[index].remove();
    for (let index = 1; index < shortcutList.length; index++) shortcutList[index].remove();


    let parser = new DOMParser();
    let addedSoftwares = []


    activeShortcutList.forEach((sCut) => {
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
}