export const navOptions = (navOptionsData) => {
    // name, icon, desc, bodyDOM

        for (const data of navOptionsData) {

            const navOption = document.createElement('li');
            navOption.innerHTML = `${data.icon}${data.name}`
            
            // On Option Item Click
            navOption.addEventListener('click', () => {
                
                // add active class to new item and remove from previous one
                document.querySelector(`nav .nav-header > .nav-menu > ul > li.active`)?.classList.remove(['active'])
                navOption.classList.add(['active'])
                
                document.querySelector('nav .nav-menu > p').textContent = data.desc;
                // document.querySelector('nav .nav-body').innerHTML = data.body ? data.body : "";
                document.querySelector('nav .nav-body').replaceChildren(data.bodyDOM);
            })

            document.querySelector('nav .nav-menu ul').appendChild(navOption)

        }
}