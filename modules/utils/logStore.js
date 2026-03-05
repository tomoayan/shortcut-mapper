// logStore.js

class LogStore {
    constructor() {
        this.logs = [];
        this.subscribers = new Set();
    }

    // Subscribe a UI component to the log store.
    subscribe(callback) {
        this.subscribers.add(callback);
        
        // Immediately send the current log history to the new subscriber
        callback({ type: 'init', payload: this.logs });

        // Return a cleanup function
        return () => this.subscribers.delete(callback);
    }


    // Push a new log to the store and notify all subscribers.
    push(message, level = 'info') {
        const logEntry = {
            id: crypto.randomUUID(), // Generates a unique ID
            timestamp: new Date().toLocaleTimeString(),
            message,
            level
        };

        // 1. Update the single source of truth
        this.logs.push(logEntry);

        // 2. Notify all connected dialogs to append this specific log
        this.subscribers.forEach(callback => {
            callback({ type: 'append', payload: [logEntry] });
        });
    }
}

// Export a single instance so all imports share the exact same object
export const globalLogger = new LogStore();