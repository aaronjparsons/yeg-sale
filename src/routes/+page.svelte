<script lang="ts">
    import { setContext } from 'svelte';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings } from '@skeletonlabs/skeleton';
    import Map, { addMarker } from '$lib/Map.svelte';

    export let data = {
        sales: []
    };

    setContext('APP', {
        ...data
    })

    $: console.log(data)

    const modalStore = getModalStore();
    const openCreateSaleModal = () => {
        const modal: ModalSettings = {
            type: 'component',
            component: 'createSaleModal',
        };
        modalStore.trigger(modal);
    }

    const handleNewSale = ({ detail }) => {
        console.log('caught dispatch', detail)
        data.sales = [...data.sales, detail];
        addMarker(detail);
    }
</script>

<div class="absolute top-5 left-5 z-10">
    <img src="./logo.png" alt="Yeg.sales logo" />
</div>
<div class="absolute top-5 left-1/2 -translate-x-1/2 z-10">
    <button type="button" class="btn variant-filled" on:click={openCreateSaleModal}>
        Add Your Sale
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