<script lang="ts">
    import { filter, getModalStore } from '@skeletonlabs/skeleton';
    import { TAGS } from './utils';
    import { Filters } from './Store';
    import { filterMapMarkers, resetMapMarkers } from './Map.svelte';

    const modalStore = getModalStore();
    let localFilters = {...$Filters};

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

    $: hasFilters = Object.values(localFilters).some(f => f?.length > 0);
</script>

<div class="relative card w-modal p-4 shadow-lg">
    <div class="flex justify-end">
        <button class="btn-icon btn-icon-sm" on:click={closeModal}>
            ✕
        </button>
    </div>
    <div class="space-y-4">
        <div>
            <p class="font-semibold text-2xl">Legend</p>
            <div class="flex flex-col gap-2">
                <div class="flex items-center">
                    <img class="h-6 mr-2" src="./green_marker.png" alt="Green map marker (active)" />
                    <p>Sales active today</p>
                </div>
                <div class="flex items-center">
                    <img class="h-6 mr-2" src="./yellow_marker.png" alt="Green map marker (active)" />
                    <p>Upcoming sales</p>
                </div>
            </div>
        </div>
        <div>
            <p class="font-semibold text-2xl">Filters</p>
            <span class="label-text">Categories</span>
            <div class="flex flex-wrap gap-2">
                {#each TAGS as tag}
                    <span
                        class="chip {localFilters.tags.includes(tag) ? 'variant-filled' : 'variant-ghost'}"
                        on:click={() => handleTagClicked(tag)}
                    >
                        {tag}
                    </span>
                {/each}
            </div>
        </div>
        <div class="flex justify-end">
            {#if hasFilters}
                <button class="btn variant-filled mr-2" on:click={clearFilters}>
                    Clear filters
                </button>
            {/if}
            <button class="btn variant-filled" on:click={applyFilters}>
                Apply filters
            </button>
        </div>
    </div>
</div>