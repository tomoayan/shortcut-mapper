<script>
    import { searchInput, keyboardIsRawKeyInput, searchResults, loadShortcuts, keyboardActiveKeys, searchQueryTime, searchIsCaseSensitive, searchIncludeDescription, isSearchVisible, keyboardIsPause, softwareList } from '../store.js';
    import { dbApi } from '../db.js';

    let timer;
    function handleInput(e) {
        $searchInput = e.target.value;
        clearTimeout(timer);
        timer = setTimeout(() => {
            loadShortcuts();
        }, 150);
    }

    async function deleteShortcut(id) {
        if (confirm("Delete this shortcut?")) {
            await dbApi.removeShortcut(id);
            await loadShortcuts();
        }
    }
</script>

<div class="explorer">
    <ul class="nav">
        <div class="main-content">
            <li class="info-heading">
                <span class="results-timing">{$searchResults.length} Results in {$searchQueryTime.toFixed(1)}ms</span>
                <span class="active-shortcut-list">
                    {#each $keyboardActiveKeys as key}
                        <span class="chip">{key}</span>
                    {/each}
                </span>
            </li>
            <li class="quick-options">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <label id="shortcutQuickOptionToggleSearch" on:click={() => $isSearchVisible = !$isSearchVisible} class:active={$isSearchVisible}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
                    <span>Search</span>
                </label>
                <input type="checkbox" id="rawInput" bind:checked={$keyboardIsRawKeyInput}>
                <label id="isRawKeyboardInput" for="rawInput" class:active={$keyboardIsRawKeyInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-up-dash"><path d="M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" /><path d="M9 20h6" /></svg>
                    <span>Processed</span>
                </label>
                <input type="checkbox" id="keyboardDisabled" bind:checked={$keyboardIsPause}>
                <label id="quickOptionKeyboardDisabled" for="keyboardDisabled" class:active={$keyboardIsPause}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-off"><path d="M 20 4 A2 2 0 0 1 22 6" /><path d="M 22 6 L 22 16.41" /><path d="M 7 16 L 16 16" /><path d="M 9.69 4 L 20 4" /><path d="M14 8h.01" /><path d="M18 8h.01" /><path d="m2 2 20 20" /><path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" /><path d="M6 8h.01" /><path d="M8 12h.01" /></svg>
                    <span>Disabled</span>
                </label>
            </li>
        </div>
        {#if $isSearchVisible}
        <div class="search-wrapper active">
            <ul class="search">
                <li class="field">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
                    <input type="text" placeholder="Type your shortcut here..." value={$searchInput} on:input={handleInput}>
                </li>
                <li class="options-wrapper" style="display: flex; gap: .5rem; align-items: center;">
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <span id="searchFilterCaseSensitive" title="Case Sensitive" on:click={() => { $searchIsCaseSensitive = !$searchIsCaseSensitive; loadShortcuts(); }} class:active={$searchIsCaseSensitive} style="cursor: pointer; opacity: {$searchIsCaseSensitive ? 1 : 0.4};">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-case-sensitive"><path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" /><path d="M22 9v7" /><path d="M3.304 13h6.392" /><circle cx="18.5" cy="12.5" r="3.5" /></svg>
                    </span>
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <span id="searchFilterIncludeDescription" title="Include Description" on:click={() => { $searchIncludeDescription = !$searchIncludeDescription; loadShortcuts(); }} class:active={$searchIncludeDescription} style="cursor: pointer; opacity: {$searchIncludeDescription ? 1 : 0.4};">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-initial"><path d="M15 5h6" /><path d="M15 12h6" /><path d="M3 19h18" /><path d="m3 12 3.553-7.724a.5.5 0 0 1 .894 0L11 12" /><path d="M3.92 10h6.16" /></svg>
                    </span>
                </li>
            </ul>
        </div>
        {/if}
    </ul>
    
    <ul class="shortcut-list">
        {#each $searchResults as shortcut (shortcut.id)}
            {@const sw = $softwareList.find(s => s.id === shortcut.software_id)}
            <li>
                <div class="title-wrapper">
                    <div class="title">
                        {#if sw && sw.iconUrl}
                            <img src={sw.iconUrl} alt={sw.name} title={sw.name} class="software-icon" />
                        {:else if sw}
                            <div class="software-icon placeholder" title={sw.name}>{sw.name.charAt(0).toUpperCase()}</div>
                        {/if}
                        <strong>{shortcut.usecase}</strong>
                        {#if shortcut.page}
                            <span class="page-chip">{shortcut.page}</span>
                        {/if}
                        <div class="active-keys">
                            <span>{shortcut.shortcut.split('⌨').join(' + ')}</span>
                        </div>
                    </div>
                    <div class="options-wrapper">
                        <span title="Pin">
                            <span></span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                        </span>
                        <span title="Edit">
                            <span></span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                        </span>
                        <span title="Move">
                            <span></span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-symlink-icon lucide-folder-symlink"><path d="M2 9.35V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7"/><path d="m8 16 3-3-3-3"/></svg>
                        </span>
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <span class="remove-icon" title="Delete" on:click={() => deleteShortcut(shortcut.id)}>
                            <span></span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </span>
                    </div>
                </div>
                {#if shortcut.extrainfo}
                    <p class="extra-info">{shortcut.extrainfo}</p>
                {/if}
            </li>
        {/each}
        {#if $searchResults.length === 0}
            <li style="opacity: 0.5; text-align: center;">No shortcuts found</li>
        {/if}
    </ul>
</div>

<style>
.explorer {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
}

ul.nav {
    display: flex;
    flex-direction: column;
}

div.main-content {
    list-style: none;
    font-size: .8rem;
    display: flex;
    align-items: start;
    justify-content: space-between;
    padding: 1rem;
}

li.info-heading {
    display: flex;
    gap: 1rem;
}

li.quick-options {
    display: flex;
    gap: .7rem;
    align-items: center;
}
li.quick-options input {
    display: none;
}
li.quick-options label {
    cursor: pointer;
    display: flex;
    gap: .3rem;
    align-items: center;
    font-size: .7rem;
    padding: .2rem;
    opacity: 0.7;
}
li.quick-options label.active {
    background-color: hsla(0, 0%, 100%, .1);
    border-radius: 2rem;
    padding: .2rem .6rem;
    opacity: 1;
}
li.quick-options svg {
    width: 1.1rem;
    height: 1.1rem;
}

.search-wrapper {
    padding: 0 1rem;
    display: flex;
    align-items: center;
    height: 4rem;
}

ul.search {
    width: 100%;
    height: 2.5rem;
    display: flex;
    gap: .5rem;
    list-style: none;
    background-color: hsla(0, 0%, 100%, 0.05);
    border-radius: 1rem;
    padding: 0 1rem;
}

ul.search li.field {
    flex-grow: 1;
    display: flex;
    gap: .5rem;
    align-items: center;
}
ul.search li.field input {
    width: 100%;
    height: 100%;
    outline: 0;
    border: 0;
    background-color: transparent;
    font-size: .8rem;
}

ul.shortcut-list {
    background-color: var(--shortcut-list-bg);
    overflow-y: auto;
    position: relative;
    min-height: 0;
    flex: 1 1 0;
}
ul.shortcut-list li {
    padding: 1.3rem;
    font-size: 1.1rem;
    border-bottom: 2px solid var(--nav-border);
}

.title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
}

.title {
    display: flex;
    gap: .5rem;
    align-items: center;
}
.software-icon {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 0.2rem;
    object-fit: contain;
}
.software-icon.placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: hsla(0, 0%, 100%, 0.1);
    font-size: 0.7rem;
    font-weight: bold;
}
.page-chip {
    font-size: .65rem;
    background-color: hsla(0, 0%, 100%, 0.1);
    color: hsl(0, 0%, 70%);
    padding: .1rem .4rem;
    border-radius: .4rem;
    font-weight: 500;
}
.title strong {
    font-weight: 600;
}

.active-keys {
    display: flex;
    gap: .5rem;
}
.active-keys span {
    color: hsl(0, 0%, 90%);
    font-size: .7rem;
    background-color: hsl(0, 0%, 15%);
    padding: .2rem .6rem;
    border-radius: 1rem;
}

p.extra-info {
    margin-top: .5rem;
    font-size: .8rem;
    font-family: Verdana, Arial, sans-serif;
    font-weight: 400;
}

div.options-wrapper {
    transform: translateX(calc(100% + 1.3rem));
    opacity: .3;
    transition: transform .4s cubic-bezier(1, 0, 1, 1) 0s, opacity .4s cubic-bezier(1, 0, 1, 1) 0s;
    position: relative;
    height: 2rem;
    width: 10rem;
    display: flex;
}

ul.shortcut-list li:hover div.options-wrapper {
    transform: translateX(0);
    opacity: 1;
    transition: transform .4s cubic-bezier(.3, 0, 0, .9) 0.5s, opacity .4s cubic-bezier(.3, 0, 0, .9) 0.5s;
}

div.options-wrapper > span {
    position: absolute;
    right: 0;
    top: 50%;
    display: block;
    cursor: pointer;
    transition: .2s ease;
    transform: translateY(-50%);
    padding: .5rem;
    transition-property: padding, background-color;
}

div.options-wrapper > span svg {
    width: 1.05rem;
    height: 1.05rem;
    color: #b3b3b3;
    transition: scale .2s ease;
}

div.options-wrapper > span:active svg {
    scale: .9;
}

div.options-wrapper > span > span {
    position: absolute;
    inset: 0;
    scale: 0;
    border-radius: .5rem;
    transition: .2s ease;
    transition-property: scale, background-color;
}

div.options-wrapper > span:hover > span {
    scale: 1;
    background-color: hsla(0, 0%, 100%, 0.2);
}

div.options-wrapper > span:nth-child(1) {
    translate: -6.6rem 0;
    pointer-events: none;
    opacity: .5;
}

div.options-wrapper > span:nth-child(2) {
    translate: -4.4rem 0;
    pointer-events: none;
    opacity: .5;
}

div.options-wrapper > span:nth-child(3) {
    translate: -2.2rem 0;
    pointer-events: none;
    opacity: .5;
}

div.options-wrapper > span:nth-child(4) {
    translate: 0rem 0;
}
</style>
