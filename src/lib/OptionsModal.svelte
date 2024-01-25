<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { TAGS } from './utils';
    import { filters } from './Store';

    const modalStore = getModalStore();

    const handleTagClicked = (tag: string) => {
        const tagIndex = $filters.tags.indexOf(tag);
        if (tagIndex === -1) {
            $filters.tags = [...$filters.tags, tag];
        } else {
            $filters.tags.splice(tagIndex, 1);
            $filters.tags = $filters.tags;
        }
    }

    const closeModal = () => {
        modalStore.close();
    }
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
            <div class="flex gap-x-6">
                <div class="flex items-center">
                    <img class="h-6 mr-2" src="./green_marker.png" alt="Green map marker (active)" />
                    <p>Active</p>
                </div>
                <div class="flex items-center">
                    <img class="h-6 mr-2" src="./yellow_marker.png" alt="Green map marker (active)" />
                    <p>Upcoming</p>
                </div>
            </div>
        </div>
        <div>
            <p class="font-semibold text-2xl">Filters</p>
            <span class="label-text">Categories</span>
            <div class="flex flex-wrap gap-2">
                {#each TAGS as tag}
                    <span
                        class="chip {$filters.tags.includes(tag) ? 'variant-filled' : 'variant-ghost'}"
                        on:click={() => handleTagClicked(tag)}
                    >
                        {tag}
                    </span>
                {/each}
            </div>
        </div>
    </div>
</div>