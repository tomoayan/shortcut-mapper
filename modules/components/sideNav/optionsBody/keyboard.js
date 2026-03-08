// this configues the nav options (body) for keyboard


import optionItemKeyboardBodyHTML from './keyboard.html?raw'
import { keyboardKeyDomListRaw, keyboardCurrVirtualName } from "../../../data.js"
import { globalLogger } from '../../../utils/logStore.js';

const keyboardLayoutsHTMLRawList = import.meta.glob('../../keyboard/*.html', {
    query: '?raw',
    import: 'default',
    eager: true
});




export const optionItemKeyboardBody = () => {
    const optionItemKeyboardBody = new DOMParser().parseFromString(optionItemKeyboardBodyHTML, 'text/html')
    const keyboardLayoutForm = optionItemKeyboardBody.getElementById('keyboardLayoutForm')
    const radioGroupIdentifier = crypto.randomUUID();





    // Append available keyboard layouts
    for (const layoutFilePath of Object.keys(keyboardLayoutsHTMLRawList)) {
        const layoutName = layoutFilePath.match(/([^/]+)(?=\.[^/.]+$)/)[0]

        const layoutRadioInput = document.createElement('input');
        layoutRadioInput.setAttribute("name", radioGroupIdentifier);
        layoutRadioInput.setAttribute("type", 'radio');
        layoutRadioInput.setAttribute("value", layoutName);
        layoutRadioInput.id = radioGroupIdentifier + layoutName;

        const layoutRadioLabel = document.createElement('label');
        layoutRadioLabel.setAttribute("for", radioGroupIdentifier + layoutName);
        layoutRadioLabel.innerText = layoutName;

        keyboardLayoutForm.appendChild(layoutRadioInput)
        keyboardLayoutForm.appendChild(layoutRadioLabel)
    }





    keyboardLayoutForm.addEventListener('change', async (event) => {
                globalLogger.push(`Selected keyboard layout: ${event.target.value}`, 'info');
        const fileName = event.target.value;
        const keyboard_wrapper = document.getElementById('keyboard-wrapper')

        if (fileName === "none") {
            for (const key in keyboardKeyDomListRaw) delete keyboardKeyDomListRaw[key]; // Delete Previous Saved Keys from Memory
            return keyboard_wrapper.innerHTML = ''
        };

        for (const layoutFilePath of Object.keys(keyboardLayoutsHTMLRawList)) {
            const layoutName = layoutFilePath.match(/([^/]+)(?=\.[^/.]+$)/)[0]
            if (layoutName === fileName) {
                const tomoElementExtractRegex = /<tomo-element>(?<element>.*)<\/tomo-element>.*?style>(?<style>.*)<\/style>/s;
                let extractedCode = tomoElementExtractRegex.exec(keyboardLayoutsHTMLRawList[layoutFilePath])
                keyboard_wrapper.innerHTML = extractedCode.groups.element + '<style>' + extractedCode.groups.style + '</style>';
            }
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
    });


    
    // set preSelect layout "none"
    keyboardLayoutForm.querySelector(`input[value='none']`).click();
    return optionItemKeyboardBody.body.firstChild
}