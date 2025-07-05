let isLogin = true
let activeKeys = []
let shortcuts = {}

async function getData() {
    const url = "/saved.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        shortcuts = json
        // console.log(Object.keys(json));
    } catch (error) {
        console.error(error.message);
    }
};
getData();




document.addEventListener('keydown', function (event) {
    const key = event.key;
    if (!activeKeys.includes(key)) {
        // Key not active
        activeKeys.push(key)
    } else {
        const keyIndex = activeKeys.indexOf(key)
        activeKeys.splice(keyIndex, 1)
    }
    console.log(activeKeys)
});



addEventListener("load", (e) => {
const keyboard = document.querySelectorAll('.keyboard .row > div')
for (const key of keyboard) {
    console.log(key)
    // [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z]
}

})