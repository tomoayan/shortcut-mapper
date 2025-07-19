// 
// 
// 
// THIS FILE **MOSTLY** CONTAIN SHORTCUT LIST RELATED CODE
// 
// 
// 



import * as localStorageData from "./modules/localStorageManager.js"
import * as keyboardManager from "./modules/nav/keyboardManager.js"
// import * as gdrive from "./drive.js";

let isLogin = true
let activeKeys = []
let keyDomList = keyboardManager.keyDomList
let shortcutsList = {
    lastModification: 0,
    softwares: {
        "Davinci Resolve": {
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/DaVinci_Resolve_17_logo.svg/240px-DaVinci_Resolve_17_logo.svg.png",
            shortcuts: [
                {
                    usecase: "copy url",
                    extrainfo: "lol",
                    shortcut: "Shift⌨Control⌨1"
                },
                {
                    usecase: "copy url",
                    extrainfo: "lol",
                    shortcut: "Shift⌨2"
                },
                {
                    usecase: "copy url",
                    extrainfo: "lol",
                    shortcut: "Alt⌨c"
                }
            ]
        }
    }
}



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

    // Other Functions
    // shortcutsList = await localStorageData.get()
    refreshSoftwareList()
    sortActiveShortcutSoftwares()
})





let isAvtiveShortcutMatched = (arr1, arr2) => {
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





const sortActiveShortcutSoftwares = async () => {
    let activeShortcutLists = [];


    // remove existing lists
    // let list = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.shortcuts > li')
    // for (let index = 1; index < list.length; index++) list[index].remove();


    for (const softwareName in shortcutsList.softwares) {
        let filteredShortcuts;
        if (activeKeys.length === 0) {
            filteredShortcuts = shortcutsList.softwares[softwareName].shortcuts;
        } else {
            filteredShortcuts = shortcutsList.softwares[softwareName].shortcuts
                .filter((sCut) => isAvtiveShortcutMatched(sCut.shortcut.split('⌨'), activeKeys));
        }

        if (filteredShortcuts.length < 1) break

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

    refreshShortcutList(activeShortcutLists);
}




// document.getElementById('addNewSoftware').addEventListener('click', async () => {
//     let softwareName = prompt("New software name", "");
//     let softwareIconURL = prompt("New software icon url", "");

//     if (!(softwareName && softwareIconURL)) return alert('fill both values!')

//     shortcutsList.softwares[softwareName] = {
//         icon: softwareIconURL,
//         shortcuts: {}
//     }
//     shortcutsList.lastModification = Date.now()

//     try {
//         localStorageData.set(shortcutsList)
//         refreshSoftwareList()
//     } catch (err) {
//         alert('could not save the new software data in local storage.\ncheck console for more info')
//         console.log(err)
//     }
// })







const refreshSoftwareList = () => {
    let list = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.software-list > li')
    console.log(list)
    for (let index = 2; index < list.length; index++)   list[index].remove();


    let parser = new DOMParser();


    const softwareLists = Object.keys(shortcutsList.softwares)
    for (let index = 0; index < softwareLists.length; index++) {
        const softwareName = softwareLists[index];
        const software = shortcutsList.softwares[softwareName];

        const htmlString = `<li>
            <span>
                <img src="${software.icon}" alt="${softwareName} logo">
                ${softwareName}
            </span>
            <span class="total">12</span>
        </li>`
        let li = parser.parseFromString(htmlString, 'text/html')
        list[1].after(li.body.firstChild)
    }
}






const refreshShortcutList = (data) => {
    // remove old active shortcuts from ui
    let list = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.shortcut-list > li')
    for (let index = 1; index < list.length; index++)   list[index].remove();


    let parser = new DOMParser();

    for (const shortcut of data) {
        const htmlString = `<li>
                                <div class="title-wrapper">
                                    <img src="${shortcut.icon}" alt="${shortcut.software}" title="${shortcut.software}">
                                    <div class="title">
                                        <strong>${shortcut.usecase}</strong>
                                        <span class="item-count">${shortcut.shortcut.replace('⌨', ' + ')}</span>
                                    </div>
                                </div>
                                <p class="extra-info">${shortcut.extrainfo}</p>
                            </li>`
        let li = parser.parseFromString(htmlString, 'text/html')
        list[0].after(li.body.firstChild)
    }
}