import { shortcutList } from "./data.js"


const isNonEmptyString = (data) => typeof data === "string" && data.trim().length > 0;

const updateLocalStorage = (newVal) => {
    if (newVal) {
        newVal.lastModification = Date.now()
        return localStorage.setItem("shortcuts", JSON.stringify(newVal));
    }

    alert('cannot update local storage, inpput was empty')
}





export const init = () => {
    return new Promise((resolve, reject) => {

        try {
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
            updateLocalStorage(shortcutListTMP)
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
            updateLocalStorage(shortcutListTMP)
            resolve()
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}