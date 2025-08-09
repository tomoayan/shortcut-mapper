export default (displayName, callbackFn, AbortControllerSignal) => {
    const toggleBTN = ```
            <label class="navButton toggle">
                <input type="checkbox">
                <div class="toggle">
                </div>
            </label>
    ```
    const newList = document.createElement("li");
    newList.innerHTML = displayName + toggleBTN;
    newList.addEventListener('click', () => option.onClick(callbackFn), { signal: AbortControllerSignal });
    return newList;
}