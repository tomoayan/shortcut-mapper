export let keyDomList = {}

let keyboardSelector = document.getElementById('keyboard-selector');




// Keyboard Selector
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
    
    const keyboard = document.querySelectorAll('.keyboard button')
    for (const key of keyboard) {
        if (key.dataset.keyPrimary) keyDomList[key.dataset.keyPrimary] = key;
        if (key.dataset.keySecondary) keyDomList[key.dataset.keySecondary] = key;
    }
}


keyboardSelector.addEventListener('change', keyboard_load())