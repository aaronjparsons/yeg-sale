<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import dayjs from '$lib/dayjs';
    import type { Dayjs } from 'dayjs';
    import { createDialog, melt } from "@melt-ui/svelte";
    import DeleteConfirmModal from './DeleteConfirmModal.svelte';
    import { SALE_TYPES, MARKERS } from "$lib/utils";
    import { Sales } from '$lib/Store';
    import { Marker, Popup } from "svelte-maplibre";
    import MapMarker from '$lib/Marker.svelte';

    let {
        sale,
        setCenter,
        today,
        index
    } : {
        sale: Sale,
        setCenter: (lat: number, lng: number) => void,
        today: Dayjs,
        index: number
    } = $props();

    const {
        elements: {
            trigger,
            overlay,
            content,
            close,
            portalled,
        },
        states: { open },
    } = createDialog({
        forceVisible: true,
    });
</script>

<Marker lngLat={{ lng: sale.lng, lat: sale.lat }} class="cursor-pointer">
    <MapMarker color={sale.active ? MARKERS.active.color : MARKERS.upcoming.color} {index} />
    <Popup closeButton offset={[0, -10]} onopen={() => setCenter(sale.lat, sale.lng)}>
        <p class="text-lg font-semibold mb-4">{SALE_TYPES[sale.type]}</p>
        <div class="space-y-2 text-base">
            <div>
                <p class="font-semibold mr-1">Address: </p>
                <p class="ml-5">{sale.address}</p>
            </div>

            <div>
                <p class="font-semibold mr-1">Days:</p>
                <div class="ml-5">
                    {#each sale.days as day}
                        {@const start = dayjs(day.startTime)}
                        {@const end = dayjs(day.endTime)}
                        <p class:font-semibold={today.isSame(start, 'day')}>
                            {start.format('MMM D')}, {start.format('h:mm a')} - {end.format('h:mm a')}
                        </p>
                    {/each}
                </div>
            </div>

            {#if sale.tags.length}
                <p class="font-semibold mr-1">Categories:</p>
                <div>
                    <div class="flex flex-wrap gap-2 ml-5 max-w-[400px]">
                        {#each sale.tags.split(',') as tag}
                            <span class="bg-primary text-white text-xs rounded py-1 px-2">{tag}</span>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if sale.owned}
                <div class="flex justify-end gap-2">
                    <button use:melt={$trigger} class="rounded-md px-2 py-1 bg-red-500 hover:bg-red-400 text-white text-sm">
                        Delete
                    </button>
                </div>
            {/if}
        </div>
    </Popup>
</Marker>

{#if $open}
    <div class="" use:melt={$portalled}>
        <div
            use:melt={$overlay}
            class="fixed inset-0 bg-black/50"
            style="z-index: 1000;"
            transition:fade={{ duration: 150 }}
        ></div>
        <div
            class="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw]
                max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white
                p-4 pt-16 shadow-lg"
            style="z-index: 1005;"
            transition:fly={{ y: 100 }}
            use:melt={$content}
        >
            <button
                use:melt={$close}
                aria-label="close"
                class="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none
                        items-center justify-center rounded-full p-1 text-xl font-semibold"
            >
                ✕
            </button>
            <h2 class="absolute left-4 top-3 text-2xl font-semibold">Confirm delete</h2>
            <DeleteConfirmModal id={sale.id} {open} />
        </div>
    </div>
{/if}