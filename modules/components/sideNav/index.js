// The ?raw suffix tells Vite to read the file as a string during the build step
import sidebarHTML from './sidebar.html?raw';
import { globalLogger } from '../../utils/logStore.js';

import { navOptions } from './navOptions.js'
import { optionItemKeyboardBody } from './optionsBody/keyboard.js'


export const sidebar = () => {
    return new Promise((resolve) => {
        globalLogger.push('nav initialization start', 'info');
        const parser = new DOMParser();
        let sidebar = parser.parseFromString(sidebarHTML, 'text/html');
        sidebar = document.body.appendChild(sidebar.body.firstChild);


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

        setTimeout(() => {
            sidebar.classList.remove('not-ready')
        }, 0);
        resolve();
    })
}