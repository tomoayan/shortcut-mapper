<script>
    import { softwareList, activeSoftwareId, loadSoftware, loadShortcuts, softwareCounts, editingSoftwareData, editingShortcutData } from '../store.js';
    import { dbApi } from '../db.js';
    import Modal from './Modal.svelte';
    
    import { onDestroy } from 'svelte';
    
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
    
    const unsubSoftware = editingSoftwareData.subscribe(data => {
        if (data) {
            newSoftwareName = data.name;
            newSoftwareIconUrl = data.iconUrl || '';
            newSoftwareIcon = null;
            showSoftwareModal = true;
        }
    });
    
    $: if (!showSoftwareModal && $editingSoftwareData) {
        $editingSoftwareData = null;
    }

    async function createSoftware() {
        if (!newSoftwareName.trim()) return alert("Missing info");
        if ($editingSoftwareData) {
            await dbApi.updateSoftware($editingSoftwareData.id, newSoftwareName, newSoftwareIcon);
        } else {
            if (!newSoftwareIcon) return alert("Missing info");
            await dbApi.addSoftware(newSoftwareName, newSoftwareIcon);
        }
        showSoftwareModal = false;
        newSoftwareName = '';
        newSoftwareIcon = null;
        if (newSoftwareIconUrl) URL.revokeObjectURL(newSoftwareIconUrl);
        newSoftwareIconUrl = '';
        await loadSoftware();
        await loadShortcuts();
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
    let newShortcutPage = '';
    let newShortcutSoftwareId = null;

    const unsubShortcut = editingShortcutData.subscribe(data => {
        if (data) {
            newShortcutName = data.usecase;
            newShortcutKeys = data.shortcut.split('⌨');
            newShortcutDetails = data.extrainfo || '';
            newShortcutPage = data.page || '';
            newShortcutSoftwareId = data.software_id;
            showShortcutModal = true;
        }
    });
    
    $: if (!showShortcutModal && $editingShortcutData) {
        $editingShortcutData = null;
    }
    
    onDestroy(() => {
        unsubSoftware();
        unsubShortcut();
    });

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

        if ($editingShortcutData) {
            await dbApi.updateShortcut(
                $editingShortcutData.id,
                newShortcutSoftwareId, 
                newShortcutName.trim(), 
                newShortcutKeys.join('⌨'), 
                newShortcutDetails.trim(),
                newShortcutPage.trim()
            );
        } else {
            await dbApi.addShortcut(
                newShortcutSoftwareId, 
                newShortcutName.trim(), 
                newShortcutKeys.join('⌨'), 
                newShortcutDetails.trim(),
                newShortcutPage.trim()
            );
        }
        showShortcutModal = false;
        newShortcutKeys = [];
        newShortcutName = '';
        newShortcutDetails = '';
        newShortcutPage = '';
        newShortcutSoftwareId = null;
        await loadSoftware(); // to refresh pages list
        await loadShortcuts();
    }
    
    function selectSoftware(id) {
        $activeSoftwareId = id;
    }

    let expandedSoftware = {};
    function toggleSoftware(e, id) {
        if (e) e.stopPropagation();
        expandedSoftware[id] = !expandedSoftware[id];
    }

    let activeContextMenu = null;
    function openContextMenu(e, type, id, page = null) {
        e.stopPropagation();
        if (activeContextMenu && activeContextMenu.type === type && activeContextMenu.id === id && activeContextMenu.page === page) {
            activeContextMenu = null;
        } else {
            activeContextMenu = { type, id, page };
        }
    }

    function closeContextMenu() {
        activeContextMenu = null;
    }
    
    // Add New Modal selection
    let showAddNewModal = false;
    function openAddNew() {
        showAddNewModal = true;
    }
</script>

<svelte:window on:click={closeContextMenu} />

<nav>
    <div class="branding">
        <div class="branding-wrapper">
            <p>
                Shortcut Mapper
                <br><span>0.0.5 (Beta)</span>
            </p>
        </div>
    </div>
    
    <div class="ul-wrapper">
        <!-- Top Pages -->
        <ul class="main-links">
            <li class="disabled">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Login
            </li>
            <li class="disabled">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                Settings
            </li>
            <li class="disabled">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-compare"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/></svg>
                Comparison
            </li>
            <li class="active">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Search
            </li>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <li class="active" on:click={openAddNew}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-square"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                Add New
            </li>
            <li class="disabled">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart-2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                Graph
            </li>
        </ul>

        <div class="category">
            <h6 class="category-title">Softwares</h6>
            <ul class="software-list">
                {#each $softwareList as software}
                    <li class="sw-item-container">
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div class="sw-item" class:active={$activeSoftwareId === software.id} on:click={(e) => { selectSoftware(software.id); toggleSoftware(e, software.id); }}>
                            <div class="sw-left">
                                {#if software.iconUrl}
                                    <img src={software.iconUrl} alt="logo">
                                {:else}
                                    <div class="sw-icon-placeholder">{software.name.charAt(0)}</div>
                                {/if}
                                <span class="sw-name">{software.name}</span>
                                <!-- toggle sub-pages -->
                                {#if software.pages && software.pages.length > 0}
                                    <span class="dropdown-icon" style="transform: {expandedSoftware[software.id] ? 'rotate(90deg)' : 'rotate(0)'}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                                    </span>
                                {/if}
                            </div>
                            
                            <div class="sw-right" style="position:relative;">
                                <!-- total count, hidden on hover -->
                                <span class="count">{$softwareCounts[software.id]?.total || 0}</span>
                                
                                <!-- hover actions -->
                                <div class="hover-actions">
                                    <span title="Options" on:click={(e) => openContextMenu(e, 'software', software.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                                    </span>
                                </div>
                                
                                {#if activeContextMenu && activeContextMenu.type === 'software' && activeContextMenu.id === software.id}
                                    <ul class="context-menu" on:click|stopPropagation>
                                        <li on:click={(e) => { e.stopPropagation(); $editingSoftwareData = software; closeContextMenu(); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                            Edit
                                        </li>
                                        <li on:click={(e) => { deleteSoftware(e, software.id); closeContextMenu(); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                            Delete
                                        </li>
                                    </ul>
                                {/if}
                            </div>
                        </div>
                        
                        {#if expandedSoftware[software.id] && software.pages && software.pages.length > 0}
                            <ul class="sw-pages">
                                {#each software.pages as page}
                                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                                    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                    <li class="page-item" on:click={() => {}}>
                                        <div class="tree-line">├─</div>
                                        <span class="page-name">{page}</span>
                                        <div class="page-right" style="position:relative;">
                                            <span class="count">{$softwareCounts[software.id]?.pages?.[page] || 0}</span>
                                            <div class="hover-actions">
                                                <span title="Options" on:click={(e) => openContextMenu(e, 'page', software.id, page)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                                                </span>
                                            </div>
                                            {#if activeContextMenu && activeContextMenu.type === 'page' && activeContextMenu.id === software.id && activeContextMenu.page === page}
                                                <ul class="context-menu" on:click|stopPropagation>
                                                    <li on:click={(e) => { e.stopPropagation(); closeContextMenu(); }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                                        Edit
                                                    </li>
                                                    <li on:click={(e) => { e.stopPropagation(); closeContextMenu(); }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                        Delete
                                                    </li>
                                                </ul>
                                            {/if}
                                        </div>
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</nav>

<!-- Unified Add Modal -->
<Modal bind:show={showAddNewModal} title="Add New">
    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
        <button class="action-btn" style="margin:0" on:click={() => {showAddNewModal = false; showSoftwareModal = true;}}>Add Software</button>
        <button class="action-btn" style="margin:0" on:click={() => {showAddNewModal = false; showShortcutModal = true;}}>Add Shortcut</button>
    </div>
</Modal>

<Modal bind:show={showSoftwareModal} title={$editingSoftwareData ? "Edit Software" : "New Software"}>
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
    <button class="action-btn" on:click={createSoftware}>{$editingSoftwareData ? "Save" : "Create"}</button>
</Modal>

<Modal bind:show={showShortcutModal} title={$editingShortcutData ? "Edit Shortcut" : "New Shortcut"}>
    <div class="new-shortcut">
        <div>
            <label>Shortcut* (Press keys)</label>
            <div class="shortcut-input-wrapper">
                <input type="text" placeholder="Focus and press keys... (Backspace to undo)" on:keydown={handleKeydown} readonly value={newShortcutKeys.join(' ⌨ ')}>
            </div>
        </div>
        <div>
            <label>Name*</label>
            <input type="text" placeholder="Shortcut Name" bind:value={newShortcutName}>
        </div>
        <div>
            <label>Details</label>
            <textarea placeholder="Shortcut details..." bind:value={newShortcutDetails}></textarea>
        </div>
        <div>
            <label>Page (e.g. Edit Page)</label>
            <input type="text" placeholder="e.g. Editing/Timeline" bind:value={newShortcutPage}>
        </div>
        <div>
            <label>Software*</label>
            <div class="sw-grid">
                {#each $softwareList as sw}
                    <div class="sw-option" class:selected={newShortcutSoftwareId === sw.id}>
                        <input type="radio" id="nav-sw-{sw.id}" name="software" value={sw.id} bind:group={newShortcutSoftwareId}>
                        <label for="nav-sw-{sw.id}">
                            <img src={sw.iconUrl} alt={sw.name}>
                            <span>{sw.name}</span>
                        </label>
                    </div>
                {/each}
            </div>
        </div>
        <button class="action-btn" on:click={createShortcut}>{$editingShortcutData ? "Save" : "Create"}</button>
    </div>
</Modal>

<style>
/* Base Navigation styles */
nav {
    width: 20rem;
    height: 100%;
    min-width: 250px;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.2rem;
    background-color: var(--nav-background);
    border: 1px solid var(--nav-border);
    position: relative;
}

div.branding {
    background-color: #3e3e3e;
    border-radius: .4rem;
    aspect-ratio: 5/2;
    position: relative;
    flex-shrink: 0;
}
div.branding .branding-wrapper {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
}
div.branding .branding-wrapper p {
    font-weight: 600;
    font-size: 1rem;
    text-align: end;
    position: relative;
}
div.branding .branding-wrapper p span {
    font-weight: 400;
    position: absolute;
    right: 0;
    bottom: -.9rem;
    font-size: .6rem;
    opacity: .9;
}

.ul-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-y: auto;
    flex-grow: 1;
}

ul.main-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: .2rem;
}

ul.main-links li {
    display: flex;
    align-items: center;
    gap: .6rem;
    padding: .5rem .8rem;
    border-radius: .4rem;
    cursor: pointer;
    font-size: .85rem;
    color: hsl(0, 0%, 70%);
    transition: background-color .2s;
}

ul.main-links li:hover:not(.disabled) {
    background-color: hsla(0, 0%, 100%, 0.05);
}

ul.main-links li.disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
}

ul.main-links li.active {
    color: hsl(0, 0%, 95%);
}

ul.main-links li svg {
    width: 1.1rem;
    height: 1.1rem;
}

.category {
    display: flex;
    flex-direction: column;
}

.category-title {
    font-size: .75rem;
    color: hsl(0, 0%, 50%);
    padding: 0 .8rem;
    margin-bottom: .5rem;
    font-weight: 500;
}

ul.software-list {
    list-style: none;
    display: flex;
    flex-direction: column;
}

.sw-item-container {
    display: flex;
    flex-direction: column;
}

.sw-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5rem .8rem;
    border-radius: .4rem;
    cursor: pointer;
    transition: background-color .2s;
    min-height: 2.2rem;
}

.sw-item:hover {
    background-color: hsla(0, 0%, 100%, 0.05);
}
.sw-item.active {
    background-color: hsla(0, 0%, 100%, 0.1);
}

.sw-left {
    display: flex;
    align-items: center;
    gap: .6rem;
    overflow: hidden;
}

.sw-left img, .sw-icon-placeholder {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: .2rem;
    object-fit: contain;
}

.sw-icon-placeholder {
    background-color: hsl(0, 0%, 25%);
    display: grid;
    place-content: center;
    font-size: .7rem;
    font-weight: 600;
}

.sw-name {
    font-size: .85rem;
    color: hsl(0, 0%, 85%);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sw-right {
    display: flex;
    align-items: center;
    gap: .4rem;
    color: hsl(0, 0%, 50%);
}

.sw-right .count {
    font-size: .7rem;
    background-color: hsla(0, 0%, 100%, 0.05);
    padding: .1rem .4rem;
    border-radius: 1rem;
}

.hover-actions {
    display: none;
    align-items: center;
    gap: .4rem;
}

.hover-actions span {
    padding: .2rem;
    border-radius: .2rem;
    cursor: pointer;
}

.hover-actions span:hover {
    background-color: hsla(0, 0%, 100%, 0.1);
    color: hsl(0, 0%, 80%);
}

.sw-item:hover .count {
    display: none;
}

.sw-item:hover .hover-actions {
    display: flex;
}

.dropdown-icon {
    display: grid;
    place-content: center;
    padding: .1rem;
    border-radius: .2rem;
    transition: transform 0.2s;
    cursor: pointer;
}
.dropdown-icon:hover {
    background-color: hsla(0, 0%, 100%, 0.1);
}

/* Pages tree */
ul.sw-pages {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding-left: 1.4rem;
}

.page-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .3rem .8rem .3rem 0;
    cursor: pointer;
    font-size: .8rem;
    color: hsl(0, 0%, 70%);
}

.page-item:hover {
    color: hsl(0, 0%, 95%);
}

.tree-line {
    color: hsl(0, 0%, 30%);
    margin-right: .5rem;
    font-family: monospace;
}

.page-name {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.page-right {
    display: flex;
    align-items: center;
}

.page-right .count {
    font-size: .7rem;
    background-color: hsla(0, 0%, 100%, 0.05);
    padding: .1rem .4rem;
    border-radius: 1rem;
}

.page-item:hover .count {
    display: none;
}

.page-item:hover .hover-actions {
    display: flex;
}

/* Modal styles from Sidebar */
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

/* Context Menu */
.context-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--nav-background);
    border: 1px solid var(--nav-border);
    border-radius: .4rem;
    padding: .3rem;
    display: flex;
    flex-direction: column;
    z-index: 10;
    min-width: 8rem;
    box-shadow: 0 .4rem 1rem hsla(0, 0%, 0%, 0.5);
    list-style: none;
}
.context-menu li {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .4rem .6rem;
    cursor: pointer;
    font-size: .8rem;
    border-radius: .2rem;
    color: hsl(0, 0%, 80%);
}
.context-menu li:hover {
    background-color: hsla(0, 0%, 100%, 0.1);
}
</style>
