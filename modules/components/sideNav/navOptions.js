export const navOptions = (navOptionsData, preOpen, sidebar) => {
    // name, icon, desc, bodyDOM

        for (const data of navOptionsData) {
            const navOption = document.createElement('li');
            navOption.innerHTML = `${data.icon}${data.name}`
            
            // On Option Item Click
            navOption.addEventListener('click', () => {
                
                // add active class to new item and remove from previous one
                sidebar.querySelector(`.nav-header > .nav-menu > ul > li.active`)?.classList.remove(['active'])
                navOption.classList.add(['active'])
                
                sidebar.querySelector('.nav-menu > p').textContent = data.desc;
                // sidebar.querySelector('.nav-body').innerHTML = data.body ? data.body : "";
                sidebar.querySelector('.nav-body').replaceChildren(data.bodyDOM);
            })

            if (preOpen && preOpen === data.name) navOption.click();

            sidebar.querySelector('.nav-menu ul').appendChild(navOption)
        }

}