<script>
    export let title = '';
    export let show = false;
    
    function close() {
        show = false;
    }
</script>

{#if show}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="popup-wrapper" on:click={close}>
        <div class="popup-box" on:click|stopPropagation>
            <div class="heading">
                <h3>{title}</h3>
                <svg on:click={close} id="close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
{/if}

<style>
    .popup-wrapper {
        position: fixed;
        inset: 0;
        z-index: 95;
        background-color: hsla(0, 0%, 0%, 0.6);
        display: grid;
        place-content: center;
        backdrop-filter: blur(.5rem);
    }

    .popup-box {
        background-color: var(--nav-background);
        border-radius: 1rem;
        border: 1px solid var(--nav-border);
        box-shadow: 0 0 5rem 3rem hsla(0, 0%, 0%, .5);
        min-width: 28rem;
        max-width: 50rem;
        max-height: 80vw;
    }

    .heading {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid var(--nav-border);
        padding: .5rem 1rem;
    }

    .heading h3 {
        font-size: 1rem;
        font-weight: 600;
        color: hsla(0, 0%, 90%);
        margin: 0;
    }

    .heading svg {
        cursor: pointer;
    }

    .content {
        padding: 1rem;
    }
    
    /* We make global selectors for child elements passed via slot */
    :global(.content input),
    :global(.content textarea) {
        border-radius: .3rem;
        padding: .5rem 1rem;
        background-color: hsl(0, 0%, 15%);
        border: 1px solid var(--nav-border);
        font-weight: 500;
        font-size: .9rem;
        color: white;
    }

    :global(.content input:focus-visible),
    :global(.content textarea:focus-visible) {
        outline: none;
    }

    :global(.content button.action-btn) {
        display: block;
        border: 1px solid hsl(0, 0%, 30%);
        background-color: hsl(0, 0%, 25%);
        border-radius: .3rem;
        padding: .5rem 0;
        width: 50%;
        font-weight: 500;
        margin: 1.5rem auto 0;
        cursor: pointer;
        color: white;
    }
    :global(.content button.action-btn:hover) {
        background-color: hsl(0, 0%, 35%);
    }
</style>
