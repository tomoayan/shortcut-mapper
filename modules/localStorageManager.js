import { lastListModification, shortcutList, softwareList } from "./data.js"


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

                let softwareListTMP = {}
                for (const [softwareName, value] of Object.entries(shortcutsData.softwares)) {
                    softwareListTMP[softwareName] = value.icon
                }
                softwareList.set(softwareListTMP)

                lastListModification.set(shortcutsData.lastModification)
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





export const removeShortcut = (softwareName, shortcut) => {
    return new Promise((resolve, reject) => {
        try {
            const haveSoftwareName = isNonEmptyString(softwareName);
            const haveShortcut = isNonEmptyString(shortcut)

            if (!haveSoftwareName || !haveShortcut) {
                console.error(`Missing Values:
                    ${!haveSoftwareName ? "\nsoftwareName" : ""}
                    ${!haveShortcut ? "\nshortcut" : ""}
                    `)
                return reject()
            }

            const shortcutListTMP = shortcutList.value;
            const itemIndex = shortcutListTMP.softwares[softwareName].shortcuts.findIndex((item) => item.shortcut === shortcut);
            // return
            if (itemIndex === -1) return reject(), alert("unable find the shortcut index, can't remove");
            shortcutListTMP.softwares[softwareName].shortcuts.splice(itemIndex, 1)
            shortcutList.set(shortcutListTMP)
            updateLocalStorage(shortcutListTMP)
            resolve()
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}





export const removeSoftware = (softwareName) => {
    return new Promise((resolve, reject) => {
        try {
            const haveSoftwareName = isNonEmptyString(softwareName);


            if (!haveSoftwareName) {
                console.log('software name is missing')
                return reject()
            }

            const shortcutListTMP = shortcutList.value;
            delete shortcutListTMP.softwares[softwareName];
            shortcutList.set(shortcutListTMP)
            updateLocalStorage(shortcutListTMP)
            resolve()
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}