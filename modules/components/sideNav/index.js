// The ?raw suffix tells Vite to read the file as a string during the build step
import sidebarHTML from './sidebar.html?raw';
import './navHelper.js'
import { globalLogger } from '../../utils/logStore.js';

function renderSidebar() {
    globalLogger.push('nav initialization start', 'info');
    const parser = new DOMParser();
    let sidebar = parser.parseFromString(sidebarHTML, 'text/html');
    sidebar = document.body.appendChild(sidebar.body.firstChild);
    setTimeout(() => {
        sidebar.classList.remove('not-ready')
    }, 0);
        

        // import('../../sideBar/navHelper.js')
}



renderSidebar()