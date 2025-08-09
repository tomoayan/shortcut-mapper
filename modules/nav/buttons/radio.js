export default (options, callbackFn, AbortControllerSignal) => {
    const radioContainerCode = ```
                <div class="navOption radio-container">
                    <div class="active-background"></div>
                </div> 
    ```

    const newList = document.createElement("li");
    newList.innerHTML = radioContainerCode;
    const radioContainer = newList.querySelector('.radio-container')
    const radioUniqueId = crypto.randomUUID();


    for (const item of options) {
        const input = document.createElement('input')
        const label = document.createElement('label')

        input.setAttribute("type", "radio");
        input.setAttribute("name", radioUniqueId + "Radio");
        input.setAttribute("id", radioUniqueId + item.value);
        label.setAttribute("for", radioUniqueId + item.value);

        label.innerHTML = item.name;
        input.setAttribute("value", item.value);

        radioContainer.appendChild(radioContainer);
    }

    // TODO: Add selecting logic for css

    return newList;
}






{/* <div class="navButton radio-container">
    <input checked id="radio-free" name="nameRadio" type="radio" />
    <label for="radio-free">Free</label>
    <input id="radio-basic" name="nameRadio" type="radio" />
    <label for="radio-basic">Basic</label>
    <input id="radio-premium" name="nameRadio" type="radio" />
    <label for="radio-premium">Premium</label>
    <input id="radio-premium2" name="nameRadio" type="radio" />
    <label for="radio-premium2">Premium 2</label>
    <input id="radio-premium3" name="nameRadio" type="radio" />
    <label for="radio-premium3">Premium3 </label>
    <input id="radio-premium4" name="nameRadio" type="radio" />
    <label for="radio-premium4">Premium 4</label>
    <input id="radio-premium5" name="nameRadio" type="radio" />
    <label for="radio-premium5">Premium5</label>

    <div class="active-background"></div>
</div> */}


{/* <script>
    const radioContainer = document.querySelector(".radio-container");
    const radioInputs = radioContainer.querySelectorAll('input');

    radioContainer.style.setProperty('--total-radio', radioInputs.length);

    for (const input of radioInputs) {
        input.addEventListener('input', (el) => {
            const input = radioContainer.querySelectorAll('input');
            for (let index = 0; index < input.length; index++) {
                if (!input[index].checked) continue;
                radioContainer.style.setProperty('--selected-input-num', index);
            }
        })
    }
</script> */}