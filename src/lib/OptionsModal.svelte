<script lang="ts">
    import { createSwitch, melt } from '@melt-ui/svelte';
    import { TAGS, SALE_TYPES } from './utils';
    import { Filters } from './Store';

    let localFilters = $state({...$Filters});

    const { open } = $props();

    const {
        elements: { root, input },
    } = createSwitch({
        onCheckedChange: ({ curr, next }) => {
            localFilters.onlyActive = next;
            return next;
        }
    });

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
        closeModal();
    }

    const clearFilters = () => {
        Filters.reset();
        localFilters = {...$Filters};
    }

    const closeModal = () => {
        $open = false;
    }

    let hasFilters = $derived(Object.values(localFilters).some(f => {
        return Array.isArray(f)
            ? f.length > 0
            : f
    }));
</script>

<style>
    #active-switch {
        width: 2.75rem;
    }

    .thumb {
        width: 1.25rem;
        height: 1.25rem;
        transform: translateX(0.125rem);
    }

    :global([data-state='checked']) .thumb {
        transform: translateX(calc(2.75rem - 1.25rem - 0.125rem));
    }
</style>

<div class="space-y-4">
    <div class="flex items-center">
        <button
            use:melt={$root}
            class="relative h-6 cursor-default rounded-full bg-slate-400 transition-colors data-[state=checked]:bg-primary"
            id="active-switch"
            aria-labelledby="active-switch-label"
        >
            <span class="thumb block rounded-full bg-white transition" />
        </button>
        <label class="pl-4 leading-none" for="active-switch" id="active-switch-label">
            Show only active sales
        </label>
        <input use:melt={$input} />
    </div>
    <div>
        <span class="font-semibold">Type:</span>
        <select bind:value={localFilters.type} id="sale-type" class="primary-select w-full">
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
                    class="{localFilters.tags.includes(tag) ? 'bg-primary text-white' : 'bg-gray-200'} text-xs rounded py-1 px-2 cursor-pointer"
                    onclick={() => handleTagClicked(tag)}
                >
                    {tag}
                </span>
            {/each}
        </div>
    </div>
    <div class="flex justify-end">
        {#if hasFilters}
            <button class="secondary-button mr-2" onclick={clearFilters}>
                Clear filters
            </button>
        {/if}
        <button class="primary-button" onclick={applyFilters}>
            Apply filters
        </button>
    </div>
</div>