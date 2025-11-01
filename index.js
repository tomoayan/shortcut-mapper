import { shortcutList, keyboardActiveKeys, keyboardIsPause, keyboardKeyDomListRaw, keyboardIsRawKeyInput } from "./modules/data.js"
import { init as localStorageDatainit } from "./modules/localStorageManager.js"
import "./modules/sideBar/newSoftwareShortcut.js"
// import * as gdrive from "./drive.js";
import './modules/shortcutExplorer/index.js'

let isLogin = true

addEventListener('DOMContentLoaded', async () => {

    // 1. Set the configuration (this part is synchronous and fine)
localforage.config({
    driver: localforage.INDEXEDDB, // Force only IndexedDB
    name: 'shortcut-mapper',
    storeName: 'data',
});

// 2. checkDatabaseSupport
(async () => {
    try {
        // localforage.ready() will try to open the database.
        // If it fails (because IndexedDB is not available),
        // it will reject, and the 'catch' block will run.
        await localforage.ready();
        console.log('IndexedDB is available and ready.');
    } catch (error) {
        // This will now correctly catch the "No drivers available" error
        console.error("IndexedDB is not available. localforage can't be initiated.", error);
        alert("IndexedDB is not available in your browser. This app requires IndexedDB to function!");
    }
})();



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

    await localStorageDatainit();
})
