import { keyDomListRaw } from "./data.js"



const ulWrapper = document.querySelector("nav > .ul-wrapper")
const closeActiveNavOptions = document.querySelector("nav > .ul-wrapper > ul.secondary > .nav")



const secNavActive = (querySelectorPath, options) => {
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

            let activeNavOptions = document.querySelectorAll("nav > .ul-wrapper > ul.secondary > li");

            for (const option of options) {
                const newList = document.createElement("li");
                newList.innerHTML = option.icon + option.name;
                newList.addEventListener('click', () => option.onClick(option.fnInput), { signal: controller.signal })
                activeNavOptions[0].after(newList)
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


}


// Options
const keyboards = [{ name: "generic", filePath: "/keyboard/generic.html" }]



addEventListener('DOMContentLoaded', async () => {
    
    // Keyboard Selector
    const setKeyboard = async (path) => {
        const tomoElementExtractRegex = /<tomo-element>(?<element>.*)<\/tomo-element>.*?style>(?<style>.*)<\/style>/s;

        let res;
        try {
            res = await fetch(path).then(res => res.text());
        } catch (err) {
            console.warn('error while fetching keyboard code')
        }

        let extractedCode = tomoElementExtractRegex.exec(res)
        const keyboard_wrapper = document.getElementById('keyboard-wrapper')
        keyboard_wrapper.innerHTML = extractedCode.groups.element + '<style>' + extractedCode.groups.style + '</style>';

        const keyboard = document.querySelectorAll('.keyboard button')
        for (const key in keyDomListRaw) delete keyDomListRaw[key];
        for (const key of keyboard) {
            if (key.dataset.keyPrimary) keyDomListRaw[key.dataset.keyPrimary] = key;
            if (key.dataset.keySecondary) keyDomListRaw[key.dataset.keySecondary] = key;
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
    secNavActive("nav > .ul-wrapper > ul.primary > #keyboardSelector", keyboardSelectorOptions)
})