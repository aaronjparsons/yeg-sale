<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { Marker, Popup } from 'svelte-maplibre';
    import type { Dayjs } from 'dayjs';
    import { createDialog, melt } from "@melt-ui/svelte";
    import MapMarker from '$lib/Marker.svelte';
    import ReportErrorModal from '$lib/modals/ReportErrorModal.svelte';
    import { MARKERS } from '$lib/utils';

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

    const todayFormatted = today.format('dddd');
</script>

<Marker lngLat={{ lng: sale.lng, lat: sale.lat }} class="cursor-pointer">
    <MapMarker color={MARKERS.permanent.color} letter={MARKERS.permanent.letter} {index} />
    <Popup closeButton offset={[0, -10]} anchor="bottom" onopen={() => setCenter(sale.lat, sale.lng)}>
        <p class="text-lg font-semibold mb-4">{sale.displayName}</p>
        <div class="space-y-2 text-base">
            <div>
                <p class="font-semibold mr-1">Address: </p>
                <p class="ml-5">{sale.address}</p>
            </div>
            <div>
                <p class="font-semibold mr-1">Website: </p>
                <a class="ml-5 text-blue-600 visited:text-purple-600" href={sale.link} target="_blank">{sale.link}</a>
            </div>
            <div>
                <p class="font-semibold mr-1">Open: </p>
                {#each sale.open.split(',') as open}
                    <p class="ml-5">{open}</p>
                {/each}
                {#if sale.open !== 'All year'}
                    <p class="ml-5 italic text-xs">
                        * Check website for exact start & end dates
                    </p>
                {/if}
            </div>
            <div>
                <p class="font-semibold mr-1">Days:</p>
                <div class="ml-5">
                    {#each sale.days.split(',') as day}
                        <p class:font-semibold={day.includes(todayFormatted)}>{day}</p>
                    {/each}
                </div>
            </div>
            <div class="flex justify-end">
                <button class="text-xs text-red-600 hover:underline" onclick={() => $open = true}>
                    Report incorrect info
                </button>
            </div>
        </div>
    </Popup>
</Marker>

{#if $open}
    <div use:melt={$portalled}>
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
            <h2 class="absolute left-4 top-3 text-2xl font-semibold">Report incorrect info</h2>
            <ReportErrorModal {sale} {open} />
        </div>
    </div>
{/if}