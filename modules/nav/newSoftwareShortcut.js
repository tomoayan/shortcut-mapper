const getBase64Data = (file) => {
    return new Promise((resolve, reject) => {
        try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.addEventListener("load", function () {
                resolve(this.result);
            });
        } catch (err) {
            reject()
            console.error(err)
        }
    })
}





const clearPopup = () => {
    const popupEl = document.getElementById('popup')

    popupEl.style.display = "none";
    popupEl.querySelector('.new-shortcut').style.display = "none";
    popupEl.querySelector('.new-software').style.display = "none";
    popupEl.querySelector('.heading').children[0].innerText = ""
    popupEl.querySelector('.new-software img').src = ""
    popupEl.querySelector('#softwareName').value = ""
    popupEl.querySelector('#shortcutName').value = ""
    popupEl.querySelector('#shortcutDetails').innerText = ""
}

document.getElementById('addNewSoftware').addEventListener('click', async () => {
    const popupEl = document.getElementById('popup')

    clearPopup()
    popupEl.querySelector('.new-software').style.display = "flex";
    popupEl.querySelector('.heading').children[0].innerText = "New Software"

    popupEl.style.display = "grid";
    popupEl.querySelector('#close').addEventListener('click', () => clearPopup())

    popupEl.querySelector('#select-file').addEventListener('change', async (e) => {
        if (e.target.files[0]) {
            popupEl.querySelector('.new-software img').src = await getBase64Data(e.target.files[0]);
        }
    })

    popupEl.querySelector('button#create').addEventListener('click', async () => {
        const logo = popupEl.querySelector('#select-file').files[0]
        const softwareName = popupEl.querySelector('#softwareName').value

        if (softwareName.trim() === "") return alert("Software Name is Empty")
        if (!logo) return alert("Logo is Missing")

        console.log(await getBase64Data(logo))
        console.log(softwareName)
        // shortcutsList.softwares[softwareName] = {
        //     icon: softwareIconURL,
        //     shortcuts: {}
        // }
        // shortcutsList.lastModification = Date.now()

        // try {
        //     localStorageData.set(shortcutsList)
        //     refreshSoftwareList()
        // } catch (err) {
        //     alert('could not save the new software data in local storage.\ncheck console for more info')
        //     console.log(err)
        // }

        clearPopup()
    })
})






document.getElementById('addNewShortcut').addEventListener('click', async () => {
    const popupEl = document.getElementById('popup')
    clearPopup()
    popupEl.querySelector('.new-shortcut').style.display = "flex";
    popupEl.querySelector('.heading').children[0].innerText = "New Shortcut"
    popupEl.style.display = "grid";

    popupEl.querySelector('#close').addEventListener('click', () => clearPopup())

    popupEl.querySelector('button#create').addEventListener('click', async () => {
        const logo = popupEl.querySelector('#select-file').files[0]
        const softwareName = popupEl.querySelector('#softwareName').value
        // const details = popupEl.querySelector('textarea').innerText

        if (softwareName.trim() === "") return alert("Shortcut Name is Empty")


        // shortcutsList.softwares[softwareName] = {
        //     icon: softwareIconURL,
        //     shortcuts: {}
        // }
        // shortcutsList.lastModification = Date.now()

        // try {
        //     localStorageData.set(shortcutsList)
        //     refreshSoftwareList()
        // } catch (err) {
        //     alert('could not save the new software data in local storage.\ncheck console for more info')
        //     console.log(err)
        // }
        clearPopup()
    })
})