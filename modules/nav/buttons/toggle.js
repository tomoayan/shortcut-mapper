export const toggleBTN = (displayName, callbackFn, AbortControllerSignal) => {
    const newToggle = document.createElement('label');
    newToggle.classList.add('navOption', 'toggle')
    newToggle.innerHTML = `
                        ${displayName}
                        <div class="toggle-bg">
                            <input type="checkbox">
                            <div class="toggle"></div>
                        </div>
                    `

    newToggle.querySelector('input').addEventListener('change', callbackFn, { signal: AbortControllerSignal })
    return newToggle;
}