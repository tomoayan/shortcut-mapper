const loadingScreen = document.getElementById('loading-screen')

if (loadingScreen){
    setTimeout(() => {
        loadingScreen.remove()
    }, 1000);
}