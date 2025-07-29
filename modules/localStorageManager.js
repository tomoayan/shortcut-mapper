import { shortcutList } from "./data.js"

const initShortcutsData = {
    lastModification: Date.now(),
    softwares: {}
}
// const _shortcutsListPrivate = {
//     lastModification: 0,
//     softwares: {}
//     // softwares: {
//     //     "Davinci Resolve": {
//     //         icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/DaVinci_Resolve_17_logo.svg/240px-DaVinci_Resolve_17_logo.svg.png",
//     //         shortcuts: [
//     //             {
//     //                 usecase: "copy url",
//     //                 extrainfo: "lol",
//     //                 shortcut: "Shift⌨Control⌨1"
//     //             },
//     //             {
//     //                 usecase: "copy url",
//     //                 extrainfo: "lol",
//     //                 shortcut: "Shift⌨2"
//     //             },
//     //             {
//     //                 usecase: "copy url",
//     //                 extrainfo: "lol",
//     //                 shortcut: "Alt⌨c"
//     //             },
//     //             {
//     //                 usecase: "copy url",
//     //                 extrainfo: "lol",
//     //                 shortcut: "f"
//     //             }
//     //         ]
//     //     }
//     // }
// }




const isNonEmptyString = (data) => typeof data === "string" && data.trim().length > 0;
shortcutList.subscribe((newVal) => {
    if (newVal) {
        newVal.lastModification = Date.now()
        localStorage.setItem("shortcuts", JSON.stringify(newVal));
    }
})





export const init = () => {
    return new Promise((resolve, reject) => {

        try {
            // If not exist
            if (!localStorage.getItem("shortcuts")) {
                localStorage.setItem("shortcuts", JSON.stringify(initShortcutsData));
            }

            if (localStorage.getItem("shortcuts")) {
                const shortcutsData = JSON.parse(localStorage.getItem("shortcuts"))
                shortcutList.set(shortcutsData)
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


            const shortcutListTMP = shortcutList.value;
            shortcutListTMP.softwares[data.softwareName] = {
                icon: data.icon,
                shortcuts: []
            }
            shortcutList.set(shortcutListTMP)

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

            const shortcutListTMP = shortcutList.value;
            shortcutListTMP.softwares[data.software].shortcuts.push({
                usecase: data.usecase,
                extrainfo: data.extrainfo,
                shortcut: data.shortcut
            })
            shortcutList.set(shortcutListTMP)

            resolve()
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}