export default (displayName, callbackFn, AbortControllerSignal) => {

    const slider = ```
                <div class="navOption slider-container">
                    <div class="track"></div>
                    <div class="thumb">
                        <div class="tooltip">50</div>
                    </div>
                    <input type="range" min="0" max="100" value="50">
                </div>
    ```

    const newList = document.createElement("li");
    newList.innerHTML = displayName + slider;

    const sliderEl = newList.querySelector('input[type="range"]');
    const tooltipEl = newList.querySelector('.tooltip');
    let currentX = 0;
    let targetX = 0;

    
    function updateTarget() {
        const percent = (sliderEl.value - sliderEl.min) / (sliderEl.max - sliderEl.min);
        targetX = percent * sliderEl.offsetWidth;
        tooltipEl.textContent = sliderEl.value;
    }
    
    function animate() {
        // TODO: Stop animation when finished
        currentX += (targetX - currentX) * 0.1; // smoothing
        console.log(currentX)
        thumb.style.left = `${currentX}px`;
        requestAnimationFrame(animate);
    }
    
    sliderEl.addEventListener('input', updateTarget);
    updateTarget();
    animate();
    
    
    
    sliderEl.addEventListener('input', () => callbackFn, { signal: AbortControllerSignal });
    return newList;
}










//         <div class="slider-container">
//             <div class="track"></div>
//             <div class="thumb">
//                 <div class="tooltip">50</div>
//             </div>
//             <input type="range" min="0" max="100" value="50">
//         </div>




//         <script>
//             const slider = document.querySelector('input[type="range"]');
//             const thumb = document.querySelector('.thumb');
//             const tooltip = document.querySelector('.tooltip');
//             let currentX = 0;
//             let targetX = 0;

//             function updateTarget() {
//                 const percent = (slider.value - slider.min) / (slider.max - slider.min);
//                 targetX = percent * slider.offsetWidth;
//                 tooltip.textContent = slider.value;
//             }

//             function animate() {
//                 // TODO: Stop animation when finished
//                 currentX += (targetX - currentX) * 0.1; // smoothing
//                 console.log(currentX)
//                 thumb.style.left = `${currentX}px`;
//                 requestAnimationFrame(animate);
//             }

//             slider.addEventListener('input', updateTarget);
//             updateTarget();
//             animate();
//         </script>