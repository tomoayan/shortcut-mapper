const initShortcutsData = {
    lastModification: Date.now(),
    softwares: {}
}
const _shortcutsListPrivate = {
    lastModification: 0,
    softwares: {}
    // softwares: {
    //     "Davinci Resolve": {
    //         icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/DaVinci_Resolve_17_logo.svg/240px-DaVinci_Resolve_17_logo.svg.png",
    //         shortcuts: [
    //             {
    //                 usecase: "copy url",
    //                 extrainfo: "lol",
    //                 shortcut: "Shift⌨Control⌨1"
    //             },
    //             {
    //                 usecase: "copy url",
    //                 extrainfo: "lol",
    //                 shortcut: "Shift⌨2"
    //             },
    //             {
    //                 usecase: "copy url",
    //                 extrainfo: "lol",
    //                 shortcut: "Alt⌨c"
    //             },
    //             {
    //                 usecase: "copy url",
    //                 extrainfo: "lol",
    //                 shortcut: "f"
    //             }
    //         ]
    //     }
    // }
}





const _deepFreeze = (obj) => {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach(prop => {
        if (obj[prop] !== null && typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
            _deepFreeze(obj[prop]);
        }
    });
    return obj;
}
const updateReadOnly = () => shortcutsList.content = _deepFreeze(structuredClone(_shortcutsListPrivate));
const isNonEmptyString = (data) => typeof data === "string" && data.trim().length > 0;
const updateLocalStorage = () => {
    _shortcutsListPrivate.lastModification = Date.now()
    localStorage.setItem("shortcuts", JSON.stringify(_shortcutsListPrivate));
}



export const shortcutsList = {
    content: undefined
};


export const update = () => {
    return new Promise((resolve, reject) => {

        try {
            // If not exist
            if (!localStorage.getItem("shortcuts")) {
                localStorage.setItem("shortcuts", JSON.stringify(initShortcutsData));
            }

            if (localStorage.getItem("shortcuts")) {
                const shortcutsData = JSON.parse(localStorage.getItem("shortcuts"))
                _shortcutsListPrivate.lastModification = shortcutsData.lastModification;
                Object.assign(_shortcutsListPrivate.softwares, shortcutsData.softwares);
                updateReadOnly()
                resolve()
            }
        } catch (err) {
            reject(err)
        }
    })
}


export const addSoftware = (data) => {
    // {
    //     softwareName: string,
    //     icon: string-base64
    // }
    return new Promise((resolve, reject) => {
        try {
            const haveName = isNonEmptyString(data.softwareName);
            const haveIcon = isNonEmptyString(data.icon);

            if (!haveName || !haveIcon) {
                alert(`${!haveName ? "Software Name" : ""} ${!haveName && !haveIcon ? "&" : ""} ${!haveIcon ? "Icon" : ""} ${!haveName && !haveIcon ? "are" : "is"} missing!`)
                return reject()
            }

            _shortcutsListPrivate.softwares[data.softwareName] = {
                icon: data.icon,
                shortcuts: []
            }
            
            updateLocalStorage()
            updateReadOnly()
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}




export const addShortcut = (data) => {
    // {
    //     software: string-name,
    //     usecase: string,
    //     extrainfo: string,
    //     shortcut: string-"Shift⌨Control⌨C"
    // }
    return new Promise((resolve, reject) => {
        try {
            const haveSoftwareName = isNonEmptyString(data.software);
            const haveUsecase = isNonEmptyString(data.usecase);
            const haveExtrainfo = isNonEmptyString(data.extrainfo);
            const haveShortcut = isNonEmptyString(data.shortcut)

            if (!haveSoftwareName || !haveUsecase || !haveShortcut) {
                alert(`Missing Fields:
                    ${!haveSoftwareName ? "\nSoftware" : ""}
                    ${!haveUsecase ? "\nName" : ""}
                    ${!haveShortcut ? "\nShortcut" : ""}
                    `)
                return reject()
            }

            _shortcutsListPrivate.softwares[data.software].shortcuts.push({
                usecase: data.usecase,
                extrainfo: data.extrainfo,
                shortcut: data.shortcut
            })

            updateLocalStorage()
            updateReadOnly()
            resolve()
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}