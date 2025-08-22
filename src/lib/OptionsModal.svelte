<script lang="ts">
    import { getModalStore, SlideToggle } from '@skeletonlabs/skeleton';
    import { TAGS, SALE_TYPES } from './utils';
    import { Filters } from './Store';
    import { filterMapMarkers, resetMapMarkers } from './Map.svelte';

    const modalStore = getModalStore();
    let localFilters = $state({...$Filters});

    const handleTagClicked = (tag: string) => {
        const tagIndex = localFilters.tags.indexOf(tag);
        if (tagIndex === -1) {
            localFilters.tags = [...localFilters.tags, tag];
        } else {
            localFilters.tags.splice(tagIndex, 1);
            localFilters.tags = localFilters.tags;
        }
    }

    const applyFilters = () => {
        $Filters = {...localFilters};
        filterMapMarkers();
        closeModal();
    }

    const clearFilters = () => {
        Filters.reset();
        localFilters = {...$Filters};
        resetMapMarkers();
    }

    const closeModal = () => {
        modalStore.close();
    }

    let hasFilters = $derived(Object.values(localFilters).some(f => {
        return Array.isArray(f)
            ? f.length > 0
            : f
    }));
</script>

<div class="relative card w-modal p-4 shadow-lg">
    <div class="flex justify-between mb-4">
        <p class="font-semibold text-2xl">Filters</p>
        <button class="btn-icon btn-icon-sm" onclick={closeModal}>
            ✕
        </button>
    </div>
    <div class="space-y-4">
        <SlideToggle name="slider-label" size="sm" bind:checked={localFilters.onlyActive}>Show only active sales</SlideToggle>
        <div>
            <span class="font-semibold">Type:</span>
            <select bind:value={localFilters.type} id="sale-type" class="select select-bordered w-full">
                <option value={null}>Any</option>
                {#each Object.entries(SALE_TYPES) as [key, value]}
                    <option value={key}>{value}</option>
                {/each}
            </select>
        </div>
        <div>
            <span class="font-semibold">Categories:</span>
            <div class="flex flex-wrap gap-2">
                {#each TAGS as tag}
                    <span
                        class="chip {localFilters.tags.includes(tag) ? 'variant-filled' : 'variant-ghost'}"
                        onclick={() => handleTagClicked(tag)}
                    >
                        {tag}
                    </span>
                {/each}
            </div>
        </div>
        <div class="flex justify-end">
            {#if hasFilters}
                <button class="btn variant-filled mr-2" onclick={clearFilters}>
                    Clear filters
                </button>
            {/if}
            <button class="btn variant-filled" onclick={applyFilters}>
                Apply filters
            </button>
        </div>
    </div>
</div>