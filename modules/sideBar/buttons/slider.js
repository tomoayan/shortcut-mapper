export const sliderEl = (displayName, callbackFn, AbortControllerSignal) => {


    const newSlider = document.createElement('div');
    newSlider.classList.add('navOption', 'slider-container')
    newSlider.innerHTML = `
                        ${displayName}
                        <div class="slider">
                            <div class="track"></div>
                            <div class="thumb-track">
                                <div class="thumb">
                                    <div class="tooltip">50</div>
                                </div>
                            </div>
                            <input type="range" min="0" max="100" value="50">
                        </div>
                                `

    const inputEl = newSlider.querySelector('input');
    const thumb = newSlider.querySelector('.thumb');
    const tooltipEl = newSlider.querySelector('.tooltip');
    let currentX = 0;
    let targetX = 0;
    let isAnimating = false;

    function roundTo(num) {
        const factor = 10 ** 3;
        return Math.round(num * factor) / factor;
    }

    function updateTarget() {
        const percent = (inputEl.value - inputEl.min) / (inputEl.max - inputEl.min);
        targetX = percent * inputEl.offsetWidth;
        tooltipEl.textContent = inputEl.value;
        if (!isAnimating) animate();
    }

    function animate() {
        if (!isAnimating) isAnimating = true;

        // stop if close enough
        if (roundTo(targetX) === roundTo(currentX)) {
            isAnimating = false
            return
        };

        currentX += (targetX - currentX) * 0.1; // smoothing
        thumb.style.left = `${(currentX / inputEl.offsetWidth) * 100}%`;
        requestAnimationFrame(animate);
    }

    inputEl.addEventListener('input', (ev) => {
        callbackFn(ev)
        updateTarget()
    }, { signal: AbortControllerSignal });

    updateTarget();
    animate();

    return newSlider;
}
