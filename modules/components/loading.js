import { globalLogger } from '../utils/logStore.js';
import { sidebar } from './sideNav/index.js'


const loadingScreen = document.getElementById('loading-screen')
const loadingScreenLogEl = loadingScreen.querySelector('.debug p')



// Helper function to append a single log to the DOM
function appendLogToDOM(log) {
    const logEl = document.createElement('span');
    // <span class="log-time">[${log.timestamp}]</span> 
    logEl.innerHTML = `
        <span class="log-msg">${log.message}</span>
    `;

    loadingScreenLogEl.appendChild(logEl);

    // Auto-scroll to the bottom of the container
    loadingScreenLogEl.scrollTop = loadingScreenLogEl.scrollHeight;
}

// Subscribe to the global store
const unsubscribe = globalLogger.subscribe((event) => {
    if (event.type === 'append') {
        event.payload.forEach(appendLogToDOM); // Only append the newly pushed logs
    }
    else if (event.type === 'init') {
        loadingScreenLogEl.innerHTML = '';
        event.payload.forEach(appendLogToDOM);
    }
});




function onDialogClose() {
    unsubscribe();
}


globalLogger.push('logStore init successfully', 'info');



document.addEventListener("DOMContentLoaded", () => {

    if (loadingScreen) {
        Promise.all([sidebar()])
            .then(([userResponse, postsResponse]) => {
                // Both finished successfully
            })
            .catch(err => console.error(err));

        setTimeout(() => {
            onDialogClose()
            loadingScreen.remove()
        }, 1000);
    }

});

