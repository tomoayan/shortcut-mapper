let isLogin = true
let activeKeys = []
let keyDomList = {}
// let shortcuts = {}

let keyboardSelector = document.getElementById('keyboard-selector');


addEventListener("load", async () => {
    setTimeout(() => {
        document.addEventListener('keydown', function (event) {
            const key = event.key;
            try {
                if (!activeKeys.includes(key)) {
                    // Key not active, so activate it!
                    activeKeys.push(key);
                    keyDomList[key].classList.add("active");
                } else {
                    const keyIndex = activeKeys.indexOf(key);
                    activeKeys.splice(keyIndex, 1);
                    keyDomList[key].classList.remove("active");
                }
            } catch (e) {
                const keyList = Object.keys(keyDomList)
                if (keyList.includes(e.key)) {
                    console.warn(key + " - key is availble the the virtual keyboard list, error is somewhere else")
                } else {
                    console.error(key + " - key is not availble on the virtual keyboard. Please report this on github issues")
                }
                console.log(e)
            }
        });
    }, 500);

    keyboardSelector.addEventListener('change', keyboard_load())
})





const keyboard_load = async () => {
    const tomoElementExtractRegex = /<tomo-element>(?<element>.*)<\/tomo-element>.*?style>(?<style>.*)<\/style>/s;
    const selectedKeyboard = keyboardSelector.value

    let res;
    try {
        res = await fetch(selectedKeyboard).then(res => res.text());
    } catch (err) {
        console.warn('error while fetching keyboard code')
    }

    let extractedCode = tomoElementExtractRegex.exec(res)
    const keyboard_wrapper = document.getElementById('keyboard-wrapper')
    keyboard_wrapper.innerHTML = extractedCode.groups.element + '<style>' + extractedCode.groups.style + '</style>';

    const keyboard = document.querySelectorAll('.keyboard .row > div')
    for (const key of keyboard) {
        if (key.dataset.keyPrimary) keyDomList[key.dataset.keyPrimary] = key;
        if (key.dataset.keySecondary) keyDomList[key.dataset.keySecondary] = key;
    }
}