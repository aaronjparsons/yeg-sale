<script lang="ts">
    import { setContext } from 'svelte';
    import { fly } from 'svelte/transition';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings } from '@skeletonlabs/skeleton';
    import Map, { addMarker } from '$lib/Map.svelte';

    export let data = {
        sales: []
    };

    // TODO: Might not need this as context anymore. Will leave for now just in case
    setContext('APP', {
        ...data
    })

    let showMenuBtns = false;

    $: console.log(data)

    const toggleMenuBtns = () => {
        showMenuBtns = !showMenuBtns;
    }

    const modalStore = getModalStore();

    const openOptionsModal = () => {
        const modal: ModalSettings = {
            type: 'component',
            component: 'optionsModal',
        };
        modalStore.trigger(modal);
    }

    const openCreateSaleModal = () => {
        const modal: ModalSettings = {
            type: 'component',
            component: 'createSaleModal',
        };
        modalStore.trigger(modal);
    }
</script>

<div class="absolute top-2 left-2 w-32 sm:top-5 sm:left-5 sm:w-auto z-10">
    <img src="./logo.png" alt="Yeg.sales logo" />
</div>

<!-- Desktop buttons -->
<div class="absolute top-36 left-5 z-10 space-y-2 hidden sm:block">
    <button type="button" class="flex btn variant-filled" on:click={openCreateSaleModal}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create sale
    </button>
    <button type="button" class="flex btn variant-filled" on:click={openOptionsModal}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        Options
    </button>
</div>

<!-- Mobile buttons -->
<div class="absolute bottom-5 right-5 z-10 block sm:hidden">
    {#if showMenuBtns}
        <div transition:fly={{ y: 70 }} class="flex flex-col items-center space-y-2 mb-2">
            <button type="button" class="btn-icon variant-filled" on:click={openOptionsModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
            </button>
            <button type="button" class="btn-icon variant-filled" on:click={openCreateSaleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>
    {/if}
    <button type="button" class="btn-icon btn-icon-lg {showMenuBtns ? 'variant-filled-surface' : 'variant-filled'}" on:click={toggleMenuBtns}>
        {#if showMenuBtns}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        {/if}
    </button>
</div>
<Map />

<style>
    :global(html, body) {
        width: 100%;
        height: 100%;
        margin: 0;
    }
</style>