import { keyboardKeyDomListRaw, keyboardCurrVirtualName } from "../data.js"

const keyboardSwitch = async (fileName) => {

    
    const keyboard_wrapper = document.getElementById('keyboard-wrapper')
    if (fileName === "none") {
        for (const key in keyboardKeyDomListRaw) delete keyboardKeyDomListRaw[key]; // Delete Previous Saved Keys from Memory
        return keyboard_wrapper.innerHTML = ''
    };
    
    
    try {
        // TODO: make a home path env to fix it
        const isGithub = window.location.hostname === "tomoayan.github.io" || window.location.hostname === "www.tomoayan.github.io" ? "/shortcut-mapper/modules/keyboard/" : "/modules/keyboard/";
        
        const res = await fetch(isGithub + fileName).then(res => res.text());
        
        const tomoElementExtractRegex = /<tomo-element>(?<element>.*)<\/tomo-element>.*?style>(?<style>.*)<\/style>/s;
        let extractedCode = tomoElementExtractRegex.exec(res)
        keyboard_wrapper.innerHTML = extractedCode.groups.element + '<style>' + extractedCode.groups.style + '</style>';
    } catch (err) {
        console.warn('error while fetching keyboard code')
    }
    
    
    for (const key in keyboardKeyDomListRaw) delete keyboardKeyDomListRaw[key]; // Delete Previous Saved Keys from Memory
    const keyboardKeys = document.querySelectorAll('.keyboard button')
    for (const key of keyboardKeys) {
        if (!key.dataset.key) continue;
        let dataKeyList = (key.dataset.key).split(" "); // " " character unicode 32
        if (dataKeyList.includes("")) dataKeyList.push(" ");
        for (const dataKey of dataKeyList) {
            if (Array.isArray(keyboardKeyDomListRaw[dataKey])) {
                keyboardKeyDomListRaw[dataKey].push(key);
            } else {
                keyboardKeyDomListRaw[dataKey] = [key]
            }
        }
    }
}


export const KeyboardHelper = (event) => {
    keyboardCurrVirtualName.set(keyboardCurrVirtualName)
    keyboardSwitch(event.currentTarget.value)
}
keyboardCurrVirtualName.subscribe(keyboardSwitch)