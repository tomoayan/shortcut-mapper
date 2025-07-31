import { keyDomListRaw, isRawKeyInput } from "./data.js"



const ulWrapper = document.querySelector("nav > .ul-wrapper")
const closeActiveNavOptions = document.querySelector("nav > .ul-wrapper > ul.secondary > .nav")



const secNavActive = (querySelectorPath, options, initFunc) => {
    // options: [{
    //     name: "name",
    //     icon: "svg url",
    //     onClick: "function",
    //     fnInput: "string/number/boolen"
    // }]

    document.querySelector(querySelectorPath)
        .addEventListener('click', () => {
            const controller = new AbortController();

            ulWrapper.id = "secActive"
            ulWrapper.classList.add('changing-activeNavOptions')
            setTimeout(() => ulWrapper.classList.remove('changing-activeNavOptions'), 200);

            let activeNav = document.querySelector("nav > .ul-wrapper > ul.secondary");

            for (const option of options) {
                const newList = document.createElement("li");
                newList.innerHTML = option.icon + option.name;
                newList.addEventListener('click', () => option.onClick(option.fnInput), { signal: controller.signal })
                activeNav.appendChild(newList)
            }

            closeActiveNavOptions.addEventListener('click', () => {
                ulWrapper.id = ""
                ulWrapper.classList.add('changing-activeNavOptions')
                setTimeout(() => {
                    let activeNavOptions = document.querySelectorAll("nav > .ul-wrapper > ul.secondary > li"); // refresh the let
                    for (let index = 1; index < activeNavOptions.length; index++) activeNavOptions[index].remove();
                    ulWrapper.classList.remove('changing-activeNavOptions')
                    controller.abort()
                }, 200); // added delay to wait for sliding animation
            }, { signal: controller.signal })
        })

    if (initFunc) initFunc.ref(initFunc.value);
}


// Options
const keyboards = [{ name: "None", filePath: undefined }, { name: "Generic", filePath: "/keyboard/generic.html", default: true }]



addEventListener('DOMContentLoaded', async () => {

    // Keyboard Selector
    const setKeyboard = async (path) => {
        const keyboard_wrapper = document.getElementById('keyboard-wrapper')
        if (!path) return keyboard_wrapper.innerHTML = '';

        const tomoElementExtractRegex = /<tomo-element>(?<element>.*)<\/tomo-element>.*?style>(?<style>.*)<\/style>/s;

        let res;
        try {
            res = await fetch(path).then(res => res.text());
        } catch (err) {
            console.warn('error while fetching keyboard code')
        }

        let extractedCode = tomoElementExtractRegex.exec(res)
        keyboard_wrapper.innerHTML = extractedCode.groups.element + '<style>' + extractedCode.groups.style + '</style>';

        const keyboardKeys = document.querySelectorAll('.keyboard button')
        for (const key in keyDomListRaw) delete keyDomListRaw[key]; // Delete Previous Saved Keys in Memory

        for (const key of keyboardKeys) {
            if (!key.dataset.key) continue;
            let dataKeyList = (key.dataset.key).split(" "); // " " unicode 32
            if (dataKeyList.includes("")) dataKeyList.push(" ");
            for (const dataKey of dataKeyList) {
                if (Array.isArray(keyDomListRaw[dataKey])) {
                    keyDomListRaw[dataKey].push(key);
                } else {
                    keyDomListRaw[dataKey] = [key]
                }
            }
        }
    }
    let keyboardSelectorOptions = []
    keyboards.forEach(keyboard => {
        keyboardSelectorOptions.push({
            name: keyboard.name,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-icon lucide-keyboard"><path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>`,
            onClick: setKeyboard,
            fnInput: keyboard.filePath
        })
    });
    secNavActive("nav > .ul-wrapper > ul.primary > #keyboardSelector", keyboardSelectorOptions, { ref: setKeyboard, value: "/keyboard/generic.html" })





    // Shortcut Key visible
    const changeIsRawKeyInput = (boolen) => isRawKeyInput.set(boolen);
    let keyInputOptions = [{
        name: "Raw Key",
        icon: `<svg style="rotate:-90deg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>`,
        onClick: changeIsRawKeyInput,
        fnInput: "true"
    },
    {
        name: "Processed Key",
        icon: `<svg style="rotate:-90deg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in-icon lucide-log-in"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>`,
        onClick: changeIsRawKeyInput,
        fnInput: false
    }]
    secNavActive("nav > .ul-wrapper > ul.primary > #keyInput", keyInputOptions)
    isRawKeyInput.subscribe((newVal) => {
        const rawInputEl = `<svg style="rotate:-90deg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>\nRaw Input`
        const processedInputEl = `<svg style="rotate:-90deg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in-icon lucide-log-in"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>\nProcessed Input`
        document.querySelector("nav > .ul-wrapper > ul.primary > #keyInput").innerHTML = newVal ? rawInputEl : processedInputEl
    })
})