import { radioBTN } from './buttons/radio.js'
import { toggleBTN } from './buttons/toggle.js'
import { sliderEl } from './buttons/slider.js';

import { tmp } from '../data.js';


export const activeNavHelper = (data, elCurrTarget) => {

    // move "active" class previous active to current element
    document.querySelector(`nav > .ul-wrapper > .nav-links > ul > li.active`)?.classList.remove(['active'])
    elCurrTarget.classList.add(['active'])


    // Options Remove Animation
    const secNavList = document.querySelector('nav > .ul-wrapper > .options-wrapper');
    secNavList.style.opacity = '0'
    secNavList.style.pointerEvents = 'none'


    // Controller Refresh
    if (tmp.oldAbortControllerSingal) tmp.oldAbortControllerSingal.abort();
    const controller = new AbortController();
    tmp.oldAbortControllerSingal = controller;


    setTimeout(async () => {
        secNavList.innerHTML = "";
        secNavList.append(...(await compileNewOptions()))
        secNavList.style.transitionTimingFunction = 'cubic-bezier(0, 0.55, 0.45, 1)'
        secNavList.style.opacity = '1'
        secNavList.style.pointerEvents = 'auto'
        setTimeout(() => {
            secNavList.style.removeProperty("transition-timing-function")
        }, 250)
    }, 250);





    const compileNewOptions = () => {
        return new Promise((resolve, reject) => {
            try {
                const template = document.createElement('template');

                // Heading Section
                const headSection = document.createElement('section');
                headSection.classList.add('nav-head');
                headSection.innerHTML = `<p>${data.description}</p>`
                template.append(headSection)


                // Add Other Section
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
                            const radioDivWrapper = radioBTN(item.options, item.callback, controller.signal, item.currValueReactor)
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
                    template.append(newSectionEl)
                }

                resolve(template.children)
            } catch (err) {
                console.error(err)
                reject()
            }
        })
    }
}