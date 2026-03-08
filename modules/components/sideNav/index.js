// The ?raw suffix tells Vite to read the file as a string during the build step
import sidebarHTML from './sidebar.html?raw';
import { initNavButtons } from './navHelper.js';
import { globalLogger } from '../../utils/logStore.js';
import { keyboardCurrVirtualName } from "../../data.js";
import { KeyboardHelper } from '../../keyboard/keyboardHelper.js';

import { navOptions } from './activeNavHelper.js'
// import optionItemKeyboardBody from './optionsBody/keyboard.html?raw'
import {optionItemKeyboardBody} from './optionsBody/keyboard.js'

const testfn = () => console.log('alert');



navOptions([
    {
        name: 'Login',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="lucide lucide-user-icon lucide-user">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    </svg>`,
        desc: `test description 4 logim`
    },
    {
        name: 'Keyboard',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
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
    </svg>`,
        desc: `test description`,
        bodyDOM: optionItemKeyboardBody()
    },
])



const navCategories = [
    {
        id: "login",
        name: "Login",
        icon: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="lucide lucide-user-icon lucide-user">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    </svg>`,
        disabled: true,
        tooltip: "login coming soon"
    },
    {
        id: "keyboard",
        name: "Keyboard",
        icon: `
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
    </svg>`,
        options: {
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
                                    name: "Generic 100% Keyboard (US)",
                                    value: "generic",
                                }
                            ],
                            callback: KeyboardHelper,
                            currValueReactor: keyboardCurrVirtualName
                        },
                        {
                            type: 'toggle',
                            name: "test",
                            callback: testfn,
                        },
                        {
                            type: 'slider',
                            name: "Keyboard Width",
                            callback: testfn,
                        },
                    ]
                }
            ]
        }
    }
];

function renderSidebar() {
    globalLogger.push('nav initialization start', 'info');
    const parser = new DOMParser();
    let sidebar = parser.parseFromString(sidebarHTML, 'text/html');
    sidebar = document.body.appendChild(sidebar.body.firstChild);

    // initNavButtons(navCategories);

    setTimeout(() => {
        sidebar.classList.remove('not-ready')
    }, 0);
}

renderSidebar() 