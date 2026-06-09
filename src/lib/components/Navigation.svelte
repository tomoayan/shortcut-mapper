<script>
    import { keyboardLayout, keyboardIsRawKeyInput } from '../store.js';
</script>

<nav>
    <div class="branding">
        <div class="branding-wrapper">
            <p>
                Shortcut Mapper
                <br><span>0.0.5 (Beta)</span>
            </p>
        </div>
    </div>
    <div class="ul-wrapper">
        <div class="nav-links">
            <ul>
                <li class="disabled" id="login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    Login
                </li>
                <li id="keyboard" class="active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard"><path d="M10 8h.01" /><path d="M12 12h.01" /><path d="M14 8h.01" /><path d="M16 12h.01" /><path d="M18 8h.01" /><path d="M6 8h.01" /><path d="M7 16h10" /><path d="M8 12h.01" /><rect width="20" height="16" x="2" y="4" rx="2" /></svg>
                    Keyboard
                </li>
            </ul>
        </div>
        <div class="options-wrapper">
            <section class="nav-head">
                <p>Select your keyboard layout to improve visualization</p>
            </section>
            
            <section>
                <h6>
                    Layout
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-question-mark"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                </h6>
                <div>
                    <div class="navOption radio-container" style="--total-radio: 2;">
                        <input type="radio" id="layout_none" value="none" bind:group={$keyboardLayout}>
                        <label for="layout_none">None</label>
                        <input type="radio" id="layout_generic" value="generic" bind:group={$keyboardLayout}>
                        <label for="layout_generic">Generic</label>
                        <div class="active-background"></div>
                    </div>
                </div>
            </section>

            <section>
                <h6>
                    Input Type
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-question-mark"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                </h6>
                <div>
                    <div class="navOption radio-container" style="--total-radio: 2;">
                        <input type="radio" id="input_raw" value={true} bind:group={$keyboardIsRawKeyInput}>
                        <label for="input_raw">Raw Input</label>
                        <input type="radio" id="input_processed" value={false} bind:group={$keyboardIsRawKeyInput}>
                        <label for="input_processed">Processed Input</label>
                        <div class="active-background"></div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <ul class="footer">
        <li>
            <a href="//github.com/tomoayan/shortcut-mapper" target="_blank">
                <svg fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <p>shortcut-mapper</p>
            </a>
        </li>
    </ul>
</nav>

<style>
nav {
    width: 20%;
    height: 100%;
    min-width: 210px;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1.2rem;
    background-color: var(--nav-background);
    border-left: 1px solid var(--nav-border);
    position: relative;
}

div.branding {
    background-color: #3e3e3e;
    border-radius: .4rem;
    aspect-ratio: 5/2;
    position: relative;
}
div.branding .branding-wrapper {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
}
div.branding .branding-wrapper p {
    font-weight: 600;
    font-size: 1rem;
    text-align: end;
    position: relative;
}
div.branding .branding-wrapper p span {
    font-weight: 400;
    position: absolute;
    right: 0;
    bottom: -.9rem;
    font-size: .6rem;
    opacity: .9;
}

.ul-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
.nav-links ul {
    display: flex;
    gap: .5rem;
}
.nav-links ul li {
    display: flex;
    align-items: center;
    gap: .3rem;
    padding: .5rem .5rem;
    border-radius: .4rem;
    cursor: pointer;
    user-select: none;
    font-size: .7rem;
    color: hsl(0, 0%, 40%);
    transition: color .2s ease;
}
.nav-links ul li.disabled {
    cursor: not-allowed;
}
.nav-links ul li.active {
    color: var(--root-font-color);
    pointer-events: none;
}
.nav-links ul li svg {
    width: 1rem;
    height: 1rem;
}

/* Options Wrapper */
.options-wrapper {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-top: 2rem;
}
.options-wrapper .nav-head {
    padding: 0 1rem 1rem;
    border-bottom: 2px solid var(--nav-border);
    margin-bottom: -2rem;
}
.options-wrapper .nav-head p {
    font-size: .7rem;
    margin-top: .3rem;
}
.options-wrapper section:not(.nav-head) {
    padding: 0 .5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.options-wrapper section:not(.nav-head) h6 {
    position: relative;
    display: flex;
    gap: .2rem;
    font-size: .8rem;
    font-weight: 500;
    opacity: .9;
    margin-bottom: -.2rem;
}
.options-wrapper section:not(.nav-head) h6 + div {
    margin-top: -.3rem;
}
.options-wrapper section:not(.nav-head) h6 svg {
    width: 1em;
    height: 1em;
    cursor: pointer;
    opacity: .5;
}

/* Radio buttons */
.navOption.radio-container {
    --main-color: hsl(51, 89%, 71%);
    --main-color-opacity: hsla(51, 89%, 71%, 0.1);
    
    display: flex;
    flex-direction: column;
    position: relative;
    isolation: isolate;
    overflow: hidden;
}
.navOption.radio-container input {
    cursor: pointer;
    appearance: none;
    position: absolute;
    opacity: 0;
}
.navOption.radio-container label {
    cursor: pointer;
    padding: .5rem;
    position: relative;
    color: grey;
    transition: all 0.4s ease-out;
    z-index: 2;
    user-select: none;
    font-size: .7rem;
}
.navOption.radio-container input:checked + label {
    color: var(--main-color);
    pointer-events: none;
}
.navOption.radio-container .active-background {
    position: absolute;
    inset: 0;
    bottom: auto;
    background-color: var(--main-color-opacity);
    height: calc(100% / var(--total-radio));
    border-radius: .5rem;
    z-index: 1;
    transition: transform .4s cubic-bezier(0.19, 1.0, 0.22, 1.0);
    transform: translateY(-100%);
}
.navOption.radio-container:has(input:nth-of-type(1):checked) .active-background {
    transform: translateY(0);
}
.navOption.radio-container:has(input:nth-of-type(2):checked) .active-background {
    transform: translateY(100%);
}

ul.footer {
    list-style: none;
}
ul.footer li a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: .5rem;
    color: hsl(0, 0%, 80%);
    user-select: none;
}
ul.footer li a p {
    font-weight: 500;
    font-size: .8rem;
    letter-spacing: .02cap;
}
ul.footer li a svg {
    width: 1.4rem;
    height: 1.4rem;
}
ul.footer li a:hover {
    text-decoration: none;
}
</style>
