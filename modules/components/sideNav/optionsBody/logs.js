import logsBodyHTMLRaw from './logs.html?raw';
import { globalLogger } from '../../../utils/logStore.js';

export const logsOptionBody = () => {
    const parser = new DOMParser();
    const logsBodyDOM = parser.parseFromString(logsBodyHTMLRaw, 'text/html').body.firstChild;

    const handleLogAction = (action) => {
        if (action.type === 'init' || action.type === 'append') {
            action.payload.forEach(log => {
                const logEl = document.createElement('p');
                logEl.textContent = `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`;
                logsBodyDOM.prepend(logEl);
            });
        }
    };

    globalLogger.subscribe(handleLogAction);

    return logsBodyDOM;
}