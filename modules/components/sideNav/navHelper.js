import { activeNavHelper } from './activeNavHelper.js'

export const initNavButtons = (navCategories) => {
    const generateNavButtons = () => {
        return navCategories.map(category => {
            const newListItem = document.createElement('li');

            if (category.disabled) {
                newListItem.setAttribute("class", "disabled");
            }

            if (category.tooltip) {
                newListItem.setAttribute("title", category.tooltip);
            }

            newListItem.innerHTML = `${category.icon}
    ${category.name}`;

            if (!category.disabled && category.options) {
                newListItem.addEventListener('click', (el) => {
                    activeNavHelper(category.options, el.currentTarget);
                });
            }

            return newListItem;
        });
    };

    const primaryList = document.querySelector("nav .nav-header > .nav-menu > ul");
    if (!primaryList) return;

    primaryList.innerHTML = "";

    const items = generateNavButtons();
    for (const item of items) {
        primaryList.append(item);
    }

    setTimeout(() => {
        const defaultActiveItem = document.querySelector("nav .nav-header > .nav-menu > ul > li:not(.disabled)");
        if (defaultActiveItem) {
            defaultActiveItem.click();
        }
    }, 0);
};