const initShortcutsData = {
    lastModification: Date.now(),
    softwares: {}
}



export const get = () => {
    return new Promise((resolve, reject) => {

        try {
            // If not exist
            if (!localStorage.getItem("shortcuts")) {
                localStorage.setItem("shortcuts", JSON.stringify(initShortcutsData));
            }

            if (localStorage.getItem("shortcuts")) {
                const shortcutsData = JSON.parse(localStorage.getItem("shortcuts"))
                resolve(shortcutsData)
            }
        } catch (err) {
            reject(err)
        }
    })
}


export const set = (data) => {
    return new Promise((resolve, reject) => {
        try {
            localStorage.setItem("shortcuts", JSON.stringify(data));
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}