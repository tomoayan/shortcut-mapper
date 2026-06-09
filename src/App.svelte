<script>
  import { onMount } from "svelte";
  import {
    loadSoftware,
    activeSoftwareId,
    loadShortcuts,
    keyboardActiveKeys,
  } from "./lib/store.js";
  import { isDbReady } from "./lib/db.js";
  import Navigation from "./lib/components/Navigation.svelte";
  import Explorer from "./lib/components/Explorer.svelte";
  import Keyboard from "./lib/components/Keyboard.svelte";

  let dbReady = false;

  onMount(() => {
    const unsub = isDbReady.subscribe((ready) => {
      dbReady = ready;
      if (ready) {
        loadSoftware();
        loadShortcuts();
      }
    });

    const unsub2 = activeSoftwareId.subscribe(() => {
      if (dbReady) {
        loadShortcuts();
      }
    });

    const unsub3 = keyboardActiveKeys.subscribe(() => {
      if (dbReady) loadShortcuts();
    });

    return () => {
      unsub();
      unsub2();
      unsub3();
    };
  });
</script>

<main>
  {#if dbReady}
    <Navigation />
    <div class="content-wrapper">
      <Keyboard />
      <div class="shortcut-explorer-wrapper">
        <Explorer />
      </div>
    </div>
  {:else}
    <p style="margin: auto; padding: 2rem;">Loading SQLite Database...</p>
  {/if}
</main>

<style>
  main {
    height: 100vh;
    display: flex;
    gap: 1rem;
    font-family: "Inter", sans-serif;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;  
    flex: 1 1 0;
  }

  .shortcut-explorer-wrapper {
    display: flex;
    flex: 1 1;
    border-radius: 1rem;
    border: 1px solid var(--nav-border);
    overflow: hidden;
    background-color: var(--nav-background);
  }
</style>
