import { keyboardIsPause, shortcutList, keyboardIsRawKeyInput } from "../data.js";
import * as localStorageManager from "../localStorageManager.js"

let popUpBoxTemplate = document.createElement("template");;

addEventListener('DOMContentLoaded', async () => {
    const tomoElementExtractRegex = /<tomo-element>(?<element>.*)<\/tomo-element>.*?style>(?<style>.*)<\/style>/s;

    let popupCodeRaw;
    try {
        const isGithub = window.location.hostname === "tomoayan.github.io" || window.location.hostname === "www.tomoayan.github.io" ? "/shortcut-mapper" : "";
        popupCodeRaw = await fetch(isGithub + "/modules/sideBar/popup.html").then(res => res.text())
    } catch (err) {
        console.warn('error while fetching popup code')
    }

    let extractedCode = tomoElementExtractRegex.exec(popupCodeRaw);
    popUpBoxTemplate.innerHTML = extractedCode.groups.element

    let style = document.createElement('style');
    document.head.appendChild(style);
    style.textContent = extractedCode.groups.style
})


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





// New Software
document.getElementById('addNewSoftware').addEventListener('click', async () => {
    keyboardIsPause.set(true)
    const controller = new AbortController()

    const newPopup = popUpBoxTemplate.content.cloneNode(true).firstElementChild
    newPopup.querySelector('.new-shortcut').remove()
    newPopup.querySelector('.heading').children[0].innerText = "New Software"

    // Closing Event Listener
    newPopup.addEventListener('click', function (e) {
        if (e.target === this) clearPopup();
    }, { signal: controller.signal })
    newPopup.querySelector('#close').addEventListener('click', () => clearPopup(), { signal: controller.signal })
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") clearPopup()
    }, { signal: controller.signal });


    newPopup.querySelector('#select-file').addEventListener('change', async (e) => {
        if (e.target.files[0]) newPopup.querySelector('.new-software img').src = await getBase64Data(e.target.files[0]);
    }, { signal: controller.signal })
    newPopup.querySelector('button#create').addEventListener('click', async () => {
        const logo = newPopup.querySelector('#select-file').files[0]
        const softwareName = newPopup.querySelector('#softwareName').value

        if (softwareName.trim().length === 0) return alert("Software Name is Empty")
        if (!logo) return alert("Logo is Missing")

        try {
            await localStorageManager.addSoftware({
                softwareName: softwareName,
                icon: await getBase64Data(logo)
            })
        } catch (err) {
            console.error(err)
            alert("Couldn't add new software, check console for the error")
        }
        clearPopup()
    }, { signal: controller.signal })

    document.body.appendChild(newPopup)

    const clearPopup = () => {
        newPopup.remove();
        controller.abort();
        keyboardIsPause.set(false)
    }
})





// New Shortcut
document.getElementById('addNewShortcut').addEventListener('click', async () => {
    keyboardIsPause.set(true)
    const controller = new AbortController()

    const newPopup = popUpBoxTemplate.content.cloneNode(true).firstElementChild
    newPopup.querySelector('.new-software').remove()
    newPopup.querySelector('.heading').children[0].innerText = "New Shortcut"

    // Closing Event Listener
    newPopup.addEventListener('click', function (e) {
        if (e.target === this) clearPopup();
    }, { signal: controller.signal })
    newPopup.querySelector('#close').addEventListener('click', () => clearPopup(), { signal: controller.signal })
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") clearPopup()
    }, { signal: controller.signal });



    newPopup.querySelector('.new-shortcut #shortcut').addEventListener('focus', (e) => {
        const KeyPresscontroller = new AbortController()

        e.target.addEventListener('keydown', (e) => {
            let activeShortcutsOfField = newPopup.querySelector('.new-shortcut #shortcut')
            const key = keyboardIsRawKeyInput.value ? e.code : e.key;
            const keyincluded = (key) => {
                const arrConvert = Array.from(activeShortcutsOfField.children);
                return arrConvert.some((span) => span.textContent === key)
            }

            if (keyincluded(key)) {
                const arrConvert = Array.from(activeShortcutsOfField.children);
                const existingKey = arrConvert.find((span) => span.textContent.includes(key))
                return existingKey.remove()
            }

            const span = document.createElement('span');
            span.textContent = key
            activeShortcutsOfField.appendChild(span)
        }, { signal: KeyPresscontroller.signal });

        e.target.addEventListener('blur', () => KeyPresscontroller.abort(), { once: true })
    }, { signal: controller.signal })


    const setInputType = (el) => {
        const rawInputEl = `<svg style="rotate:-90deg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>\nRaw`
        const processedInputEl = `<svg style="rotate:-90deg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in-icon lucide-log-in"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>\nProcessed`
        const element = el.currentTarget ? el.currentTarget : el;
        element.innerHTML = keyboardIsRawKeyInput.value ? rawInputEl : processedInputEl;
    }
    setInputType(newPopup.querySelector('.new-shortcut .input-toggle-btn'))
    newPopup.querySelector('.new-shortcut .input-toggle-btn').addEventListener('click', (e) => {
        keyboardIsRawKeyInput.set(!keyboardIsRawKeyInput.value)
        newPopup.querySelector('.new-shortcut #shortcut').innerHTML = '';
        setInputType(e)
    }, { signal: controller.signal })


    const selectSoftwareList = newPopup.querySelector('.software-list');
    const softwareSelectElTemplate = selectSoftwareList.children[0]
    selectSoftwareList.children[0].remove()
    const softwareList = Object.keys(shortcutList.value.softwares);

    softwareList.forEach((softwareName) => {
        let element = softwareSelectElTemplate.cloneNode(true);

        element.querySelector('input').value = softwareName;
        element.querySelector('input').id = 'shortcutmapper' + softwareName;
        element.querySelector('label').setAttribute('for', 'shortcutmapper' + softwareName);
        element.querySelector('label > span').textContent = softwareName;
        element.querySelector('img').src = shortcutList.value.softwares[softwareName].icon;

        newPopup.querySelector('.software-list').appendChild(element)
    })



    newPopup.querySelector('button#create').addEventListener('click', async () => {
        const shortcuts = Array.from(newPopup.querySelector('#shortcut').children).map(span => span.textContent)
        const shortcutName = newPopup.querySelector('#shortcutName').value.trim();
        const shortcutDetails = newPopup.querySelector('#shortcutDetails').value.trim();
        const shortcutSoftware = newPopup.querySelector('.software-list input[name="software"]:checked').value.trim();

        if (shortcuts.length < 1) return alert('shortcut missing')
        if (shortcutName.length < 1) return alert('shortcut name is missing')
        if (shortcutSoftware.length < 1) return alert('select a software')


        try {
            await localStorageManager.addShortcut({
                software: shortcutSoftware,
                usecase: shortcutName,
                extrainfo: shortcutDetails,
                shortcut: shortcuts.join('⌨')
            })
        } catch (err) {
            console.error(err)
            alert("Couldn't add new shortcut, check console for the error")
        }
        clearPopup()
    }, { signal: controller.signal })




    document.body.appendChild(newPopup)

    const clearPopup = () => {
        newPopup.remove();
        controller.abort();
        keyboardIsPause.set(false)
    }
})