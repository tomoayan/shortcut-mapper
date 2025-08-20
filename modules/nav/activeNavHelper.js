import { radioBTN } from '../nav/buttons/radio.js'
import { toggleBTN } from '../nav/buttons/toggle.js'
import { sliderEl } from './buttons/slider.js';


export const activeNavHelper = (data) => {
    const secNavList = document.querySelector('nav > .ul-wrapper > .secondary');
    secNavList.innerHTML = "";
    const navEl = document.querySelector('nav');
    const navAnimatingTime = 200; // ms
    const controller = new AbortController();

    navEl.classList.add('changing-activeNavOptions');
    setTimeout(() => navEl.classList.remove('changing-activeNavOptions'), navAnimatingTime);
    navEl.id = "secActive";


    // Heading Section
    const headSection = document.createElement('section');
    headSection.classList.add('nav-head');
    headSection.innerHTML = `
                    <h3>
                        <div class="icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path
                                    d="m8.854 11.646 5.792-5.792a.5.5 0 0 1 .854.353v11.586a.5.5 0 0 1-.854.353l-5.792-5.792a.5.5 0 0 1 0-.708Z">
                                </path>
                            </svg>
                        </div>
                        ${data.heading}
                    </h3>
                    <p>${data.description}</p>
    `
    secNavList.append(headSection)




    // CLOSE
    headSection.querySelector('.nav-head h3').addEventListener('click', () => {
        navEl.id = ""
        navEl.classList.add('changing-activeNavOptions')
        setTimeout(() => {
            secNavList.innerHTML = '';
            navEl.classList.remove('changing-activeNavOptions')
            controller.abort()
        }, navAnimatingTime);
    }, { signal: controller.signal })




    // OTHER SECTION
    // Section Add
    for (const section of data.sections) {
        const newSectionEl = document.createElement('section');
        newSectionEl.innerHTML = `
                    <h6 data-tooltip="${section.tooltip}">
                        ${section.subHeading}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-circle-question-mark-icon lucide-circle-question-mark">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <path d="M12 17h.01" />
                        </svg>
                    </h6>
                    `
        // Items/Buttons Add
        for (const item of section.items) {
            const newListDiv = document.createElement('div')


            if (item.type === 'select') {
                const radioDivWrapper = radioBTN(item.options, item.callback, controller.signal)
                newListDiv.append(radioDivWrapper)
            }

            if (item.type === 'toggle') {
                const newToggle = toggleBTN(item.name, item.callback, controller.signal)
                newListDiv.append(newToggle)
            }

            if (item.type === 'slider') {
                const newSlider = sliderEl(item.name, item.callback, controller.signal)
                newListDiv.append(newSlider)
            }

            newSectionEl.append(newListDiv)
        }
        secNavList.append(newSectionEl)
    }



}