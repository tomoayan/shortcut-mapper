export const radioBTN =  (options, callbackFn, AbortControllerSignal) => {
    const radioUniqueId = crypto.randomUUID();
    const radioDivWrapper = document.createElement('div');
    radioDivWrapper.classList.add('navOption', 'radio-container')
    radioDivWrapper.innerHTML = `<div class="active-background"></div>`
    radioDivWrapper.style.setProperty('--total-radio', options.length)

    for (const item of options) {
        const optionHTMLCode = `
                                <input id="${radioUniqueId + "-" + item.value}" name="${radioUniqueId + "Radio"}" type="radio" value="${item.value}" />
                                <label for="${radioUniqueId + "-" + item.value}">${item.name}</label>
                                `
        radioDivWrapper.innerHTML += optionHTMLCode;
    }

    radioDivWrapper.querySelectorAll('input').forEach(e => e.addEventListener('change', callbackFn, { signal: AbortControllerSignal }))
    return radioDivWrapper;
}