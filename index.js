let isLogin = true
let activeKeys = []
let shortcuts = {}
let keys = {}

addEventListener("load", async () => {




    setTimeout(() => {
        document.addEventListener('keydown', function (event) {
            const key = event.key;
            try {
                if (!activeKeys.includes(key)) {
                    // Key not active, so activate it!
                    activeKeys.push(key);
                    keys[key].classList.add("active");
                } else {
                    const keyIndex = activeKeys.indexOf(key);
                    activeKeys.splice(keyIndex, 1);
                    keys[key].classList.remove("active");
                }
            } catch (e) {
                const keyList = Object.keys(keys)
                if (keyList.includes(e.key)) {
                    console.warn(e.key + " key is availble the the virtual keyboard list, error is somewhere else")
                } else {
                    console.error(e.key + " key is not availble on the virtual keyboard. Please report this on github issues")
                    console.log(e)
                }
            }
        });
    }, 500);




    try {

        const tomoElementExtractRegex = /<tomo-element>(?<element>.*)<\/tomo-element>.*?style>(?<style>.*)<\/style>/s;
        const keyboardList = ['/keyboard/generic.html']

        const res = await fetch(keyboardList[0]).then(res => res.text());
        let element = tomoElementExtractRegex.exec(res)

        const keyboard_wrapper = document.getElementById('keyboard-wrapper')

        keyboard_wrapper.innerHTML = element.groups.element + '<style>' + element.groups.style + '</style>';


        const keyboard = document.querySelectorAll('.keyboard .row > div')
        for (const key of keyboard) {
            // key.dataset.keyPrimary === acKey || key.dataset.keySecondary === acKey
            if (key.dataset.keyPrimary) {
                keys[key.dataset.keyPrimary] = key;
            }

            if (key.dataset.keySecondary) {
                keys[key.dataset.keyPrimary] = key;
            }
        }
    } catch (error) {
        console.error(error);
    }

})





// async function getData() {
//     const url = "/saved.json";
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }

//         const json = await response.json();
//         shortcuts = json
//         // console.log(Object.keys(json));
//     } catch (error) {
//         console.error(error.message);
//     }
// };
// getData();




