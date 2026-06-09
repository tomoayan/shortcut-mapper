<script>
    import { softwareList, activeSoftwareId, loadSoftware, loadShortcuts, softwareCounts } from '../store.js';
    import { dbApi } from '../db.js';
    import Modal from './Modal.svelte';
    
    let showSoftwareModal = false;
    let newSoftwareName = '';
    let newSoftwareIcon = null;
    let newSoftwareIconUrl = '';
    
    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            newSoftwareIcon = file;
            if (newSoftwareIconUrl) URL.revokeObjectURL(newSoftwareIconUrl);
            newSoftwareIconUrl = URL.createObjectURL(file);
        }
    }
    
    async function createSoftware() {
        if (!newSoftwareName.trim() || !newSoftwareIcon) return alert("Missing info");
        await dbApi.addSoftware(newSoftwareName, newSoftwareIcon);
        showSoftwareModal = false;
        newSoftwareName = '';
        newSoftwareIcon = null;
        if (newSoftwareIconUrl) URL.revokeObjectURL(newSoftwareIconUrl);
        newSoftwareIconUrl = '';
        await loadSoftware();
    }

    async function deleteSoftware(e, id) {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this software and all its shortcuts?')) {
            await dbApi.removeSoftware(id);
            if ($activeSoftwareId === id) $activeSoftwareId = null;
            await loadSoftware();
            await loadShortcuts();
        }
    }

    let showShortcutModal = false;
    let newShortcutKeys = [];
    let newShortcutName = '';
    let newShortcutDetails = '';
    let newShortcutPath = '';
    let newShortcutSoftwareId = null;

    function handleKeydown(e) {
        e.preventDefault();
        const key = e.key;
        if (key === 'Escape') return; // let modal close
        if (key === 'Backspace') {
            newShortcutKeys = newShortcutKeys.slice(0, -1);
            return;
        }
        if (!newShortcutKeys.includes(key)) {
            newShortcutKeys = [...newShortcutKeys, key];
        }
    }

    async function createShortcut() {
        if (newShortcutKeys.length < 1) return alert('shortcut missing');
        if (newShortcutName.trim().length < 1) return alert('shortcut name is missing');
        if (!newShortcutSoftwareId) return alert('select a software');

        await dbApi.addShortcut(
            newShortcutSoftwareId, 
            newShortcutName.trim(), 
            newShortcutKeys.join('⌨'), 
            newShortcutDetails.trim(),
            newShortcutPath.trim()
        );
        showShortcutModal = false;
        newShortcutKeys = [];
        newShortcutName = '';
        newShortcutDetails = '';
        newShortcutPath = '';
        newShortcutSoftwareId = null;
        await loadShortcuts();
    }
    
    function selectSoftware(id) {
        $activeSoftwareId = id;
    }
</script>

<div class="side-panel">
    <ul class="nav">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li on:click={() => showSoftwareModal = true}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-package-plus-icon lucide-package-plus">
                <path d="M16 16h6" />
                <path d="M19 13v6" />
                <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                <path d="m7.5 4.27 9 5.15" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" x2="12" y1="22" y2="12" />
            </svg>
            <p>Software</p>
        </li>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li on:click={() => showShortcutModal = true}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-arrow-big-up-icon lucide-arrow-big-up">
                <path d="M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" />
            </svg>
            <p>Shortcut</p>
        </li>
    </ul>
    <ul class="software-list">
        {#each $softwareList as software}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <li class:active={$activeSoftwareId === software.id} on:click={() => selectSoftware(software.id)}>
                <span>
                    {#if software.iconUrl}
                        <img src={software.iconUrl} alt="logo">
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    {/if}
                    {software.name}
                </span>
                <div class="option-wrapper">
                    <span class="total">{$softwareCounts[software.id] || 0}</span>
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <span class="remove-icon" title="Remove software" on:click={(e) => deleteSoftware(e, software.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </span>
                </div>
            </li>
        {/each}
        {#if $softwareList.length === 0}
            <li style="justify-content: center; opacity: 0.5;">No software added</li>
        {/if}
    </ul>
</div>

<Modal bind:show={showSoftwareModal} title="New Software">
    <div class="basic-sw">
        <div class="select-image">
            <label for="select-file">Select<br>Image</label>
            {#if newSoftwareIconUrl}
                <img src={newSoftwareIconUrl} alt="Logo" />
            {/if}
            <input id="select-file" type="file" accept="image/*" on:change={handleFileChange}>
        </div>
        <input type="text" placeholder="Enter Software Name*" bind:value={newSoftwareName}>
    </div>
    <button class="action-btn" on:click={createSoftware}>Create</button>
</Modal>

<Modal bind:show={showShortcutModal} title="New Shortcut">
    <div class="new-shortcut">
        <div>
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Shortcut* (Press keys)</label>
            <div class="shortcut-input-wrapper">
                <input type="text" placeholder="Focus and press keys... (Backspace to undo)" on:keydown={handleKeydown} readonly value={newShortcutKeys.join(' ⌨ ')}>
            </div>
        </div>
        <div>
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Name*</label>
            <input type="text" placeholder="Shortcut Name" bind:value={newShortcutName}>
        </div>
        <div>
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Details</label>
            <textarea placeholder="Shortcut details..." bind:value={newShortcutDetails}></textarea>
        </div>
        <div>
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Path (optional folder nesting)</label>
            <input type="text" placeholder="e.g. Editing/Timeline" bind:value={newShortcutPath}>
        </div>
        <div>
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Software*</label>
            <div class="sw-grid">
                {#each $softwareList as sw}
                    <div class="sw-option" class:selected={newShortcutSoftwareId === sw.id}>
                        <input type="radio" id="sw-{sw.id}" name="software" value={sw.id} bind:group={newShortcutSoftwareId}>
                        <label for="sw-{sw.id}">
                            <img src={sw.iconUrl} alt={sw.name}>
                            <span>{sw.name}</span>
                        </label>
                    </div>
                {/each}
            </div>
        </div>
        <button class="action-btn" on:click={createShortcut}>Create</button>
    </div>
</Modal>

<style>
.side-panel {
    flex: 0 0 25%;
    min-width: 250px;
    max-width: 50%;
    display: flex;
    flex-direction: column;
}

ul.nav {
    display: flex;
    flex-wrap: wrap;
    font-size: .9rem;
}
ul.nav li {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    flex-grow: 1;
    flex-basis: 50%;
    font-weight: 500;
    height: 3rem;
    cursor: pointer;
    color: #b3b3b3;
    background-color: var(--shortcut-nav-background);
    border: 1px solid var(--nav-border);
    border-top: 0;
}
ul.nav li:first-child {
    border-left: 0;
    border-right: 0;
}
ul.nav li:nth-child(3) {
    border-left: 0;
}
ul.nav li svg {
    width: 1.1rem;
    height: 1.1rem;
    color: #b3b3b3;
}

ul.software-list {
    background-color: var(--shortcut-nav-background);
    border-right: 1px solid var(--nav-border);
    height: 100%;
    overflow-y: auto;
}
ul.software-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background-color .05s;
    padding: 1rem;
    font-size: .8rem;
}
ul.software-list li.active {
    background-color: hsla(0, 0%, 100%, 0.1);
}
ul.software-list li span {
    display: flex;
    align-items: center;
    gap: .5rem;
}
.option-wrapper {
    display: flex;
    gap: .3rem;
    align-items: center;
}
.option-wrapper span:not(.total) {
    display: none;
    margin-left: .5rem;
    cursor: pointer;
    padding: .1rem;
}
.option-wrapper span:not(.total):hover {
    opacity: .8;
}
.option-wrapper span:not(.total):active {
    opacity: .5;
}
.option-wrapper span:not(.total) svg {
    width: 1rem;
    height: 1rem;
}
ul.software-list li img, ul.software-list li svg {
    width: 1.5rem;
    height: 1.5rem;
    user-select: none;
}
ul.software-list li:hover .option-wrapper span {
    display: inline;
}

/* Modal styles local to Sidebar for content injection */
.basic-sw {
    display: flex;
    align-items: center;
    gap: 1rem;
}
.select-image {
    width: 4rem;
    height: 4rem;
    position: relative;
    border-radius: .3rem;
    overflow: hidden;
    background-color: hsl(0, 0%, 15%);
}
.select-image input {
    display: none;
}
.select-image label {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    font-size: .7rem;
    cursor: pointer;
    z-index: 97;
    background-color: hsla(0, 0%, 15%, 0.5);
    user-select: none;
    text-align: center;
}
.select-image img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 96;
}
.basic-sw > input {
    flex-grow: 1;
}

.new-shortcut {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.new-shortcut div {
    display: flex;
    flex-direction: column;
    gap: .3rem;
}
.new-shortcut label {
    font-size: .8rem;
    font-weight: 500;
}
.new-shortcut input, .new-shortcut textarea {
    width: 100%;
}

.sw-grid {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    flex-direction: row !important;
}
.sw-option {
    border-radius: .5rem;
    background-color: hsl(0, 0%, 15%);
    opacity: .5;
    transition: opacity .2s;
}
.sw-option input {
    display: none;
}
.sw-option label {
    display: flex;
    flex-direction: row !important;
    gap: .5rem;
    align-items: center;
    padding: .4rem .8rem;
    cursor: pointer;
    font-size: .8rem;
}
.sw-option label img {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: .2rem;
}
.sw-option.selected {
    opacity: 1;
    background-color: hsl(0, 0%, 25%);
}
</style>
