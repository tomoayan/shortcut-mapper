import * as localStorageData from "./localStorageManager.js"
// import * as gdrive from "./drive.js";

let isLogin = true
let activeKeys = []
let keyDomList = {}
let shortcutsList = {
    lastModification: 0,
    softwares: {
        davinci: {
            icon: "./img/DaVinci_Resolve_17_logo.svg.png",
            name: "Davinci Resolve 2",
            shortcuts: {
                "shift⌨ctrl⌨c": {
                    usecase: "copy url",
                    extrainfo: "lol"
                }
            }
        }
    }
}

let keyboardSelector = document.getElementById('keyboard-selector');


addEventListener('DOMContentLoaded', async () => {
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
            } catch (e) {
                const keyList = Object.keys(keyDomList)
                if (keyList.includes(e.key)) {
                    console.warn(key + " - key is availble the the virtual keyboard list, error is somewhere else")
                } else {
                    console.error(key + " - key is not availble on the virtual keyboard. Please report this on github issues")
                }
                console.log(e)
            }
        });
    }, 500);

    keyboardSelector.addEventListener('change', keyboard_load())
    shortcutsList = await localStorageData.get()
    refreshSoftwareList()
})




// Keyboard Selector
const keyboard_load = async () => {
    const tomoElementExtractRegex = /<tomo-element>(?<element>.*)<\/tomo-element>.*?style>(?<style>.*)<\/style>/s;
    const selectedKeyboard = keyboardSelector.value

    let res;
    try {
        res = await fetch(selectedKeyboard).then(res => res.text());
    } catch (err) {
        console.warn('error while fetching keyboard code')
    }

    let extractedCode = tomoElementExtractRegex.exec(res)
    const keyboard_wrapper = document.getElementById('keyboard-wrapper')
    keyboard_wrapper.innerHTML = extractedCode.groups.element + '<style>' + extractedCode.groups.style + '</style>';

    const keyboard = document.querySelectorAll('.keyboard .row > div')
    for (const key of keyboard) {
        if (key.dataset.keyPrimary) keyDomList[key.dataset.keyPrimary] = key;
        if (key.dataset.keySecondary) keyDomList[key.dataset.keySecondary] = key;
    }
}






document.getElementById('addNewSoftware').addEventListener('click', async () => {
    let softwareName = prompt("New software name", "");
    let softwareIconURL = prompt("New software icon url", "");

    if (!(softwareName && softwareIconURL)) return alert('fill both values!')

    shortcutsList.softwares[softwareName] = {
        icon: softwareIconURL,
        shortcuts: {}
    }
    shortcutsList.lastModification = Date.now()

    try {
        localStorageData.set(shortcutsList)
        refreshSoftwareList()
    } catch (err) {
        alert('could not save the new software data in local storage.\ncheck console for more info')
        console.log(err)
    }
})







const refreshSoftwareList = () => {
    let list = document.querySelectorAll('.content-wrapper > .shortcut-wrapper > ul.software-list > li')
    for (let index = 1; index < list.length - 1; index++)   list[index].remove();


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
        list[0].after(li.body.firstChild)
    }
}
