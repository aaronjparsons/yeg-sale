<script lang="ts">
    import { Modal, modalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
    import Map, { addMarker } from '$lib/Map.svelte';
    import CreateSaleModal from '$lib/CreateSaleModal.svelte';

    export let data = {
        sales: []
    };

    const openCreateSaleModal = () => {
        const modalComponent: ModalComponent = {
            // Pass a reference to your custom component
            ref: CreateSaleModal,
            // Add your props as key/value pairs
            props: {  },
        };
        const d: ModalSettings = {
            type: 'component',
            component: modalComponent
        };
        modalStore.trigger(d);
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
<Map data={data.sales} />
<Modal />

<style>
    :global(html, body) {
        width: 100%;
        height: 100%;
        margin: 0;
    }
</style>