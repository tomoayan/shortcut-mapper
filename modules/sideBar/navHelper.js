import { keyboardKeyDomListRaw, keyboardIsRawKeyInput, keyboardCurrVirtualName } from "../data.js"
import { activeNavHelper } from './activeNavHelper.js'
import { KeyboardHelper } from '../keyboard/keyboardHelper.js'
import { inputHelper } from "./other/inputHelper.js";

let primaryNavButtons = [];
// const closeActiveNavOptions = document.querySelector("nav > .ul-wrapper > .secondary > ul > .nav")

const testfn = () => console.log('alert')




// Login
primaryNavButtons.push(() => {
    const newListItem = document.createElement('li');
    newListItem.setAttribute("class", "disabled");
    newListItem.setAttribute("title", "login coming soon");
    newListItem.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="lucide lucide-user-icon lucide-user">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    </svg>
    Login
    `

    return newListItem;
})




// Keyboard Layout Selector
primaryNavButtons.push(() => {
    const newListItem = document.createElement('li');
    // newListItem.setAttribute("class", "active");
    newListItem.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="lucide lucide-keyboard-icon lucide-keyboard">
    <path d="M10 8h.01" />
    <path d="M12 12h.01" />
    <path d="M14 8h.01" />
    <path d="M16 12h.01" />
    <path d="M18 8h.01" />
    <path d="M6 8h.01" />
    <path d="M7 16h10" />
    <path d="M8 12h.01" />
    <rect width="20" height="16" x="2" y="4" rx="2" />
    </svg>
    Keyboard
    `

    // Keyboard Options/Settings
    newListItem.addEventListener('click', (el) => {
        activeNavHelper({
            heading: "Keyboard Layout",
            description: "Select your keyboard layout to improve viulization",
            sections: [
                {
                    subHeading: "Layout",
                    tooltip: "Choose your keyboard layout. This is for visualization purposes and doesn't conflic with key input feature. if a key doesn't exist in the visulization keyboard, it will not cause an error on site functionality.",
                    items: [
                        {
                            type: 'select',
                            options: [
                                {
                                    name: "None",
                                    value: "none",
                                },
                                {
                                    name: "Generic",
                                    value: "generic",
                                }
                            ],
                            callback: KeyboardHelper,
                            currValueReactor: keyboardCurrVirtualName
                        },
                        // {
                        //     type: 'toggle',
                        //     name: "test",
                        //     callback: testfn,
                        // },
                        // {
                        //     type: 'slider',
                        //     name: "Keyboard Width",
                        //     callback: testfn,
                        // },
                    ]
                },
                {
                    subHeading: "Input Type",
                    tooltip: "Gemini Write Something",
                    items: [
                        {
                            type: 'select',
                            options: [
                                {
                                    name: "Raw Input",
                                    value: "raw",
                                },
                                {
                                    name: "Processed Input",
                                    value: "processed",
                                }
                            ],
                            callback: inputHelper,
                            currValueReactor: keyboardIsRawKeyInput
                        }
                    ]
                }
            ]
        }, el.currentTarget)
    })
    return newListItem;
})







document.addEventListener('DOMContentLoaded', () => {
    const primaryList = document.querySelector("nav > .ul-wrapper > .nav-links > ul");
    primaryList.innerHTML = "";
    for (const el of primaryNavButtons) {
        primaryList.append(el());
    }

setTimeout(() => {
        document.querySelector("nav > .ul-wrapper > .nav-links > ul > li:not(.disabled)").click();
}, 0);
    
})