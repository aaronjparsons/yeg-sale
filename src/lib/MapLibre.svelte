<script lang="ts">
    import dayjs from '$lib/dayjs';
    import { onMount } from 'svelte';
    import { MapLibre, NavigationControl } from 'svelte-maplibre';
    import PermenantMarker from '$lib/PermenantMarker.svelte';
    import SalesMarker from './SalesMarker.svelte';
    import { Sales, DisplayedSales, Filters } from '$lib/Store';

    let center = { lat: 53.5461, lng: -113.4938 }
    let zoom = 9;
    let minZoom = 9;
    let showMarkers = false;

    onMount(() => {
        zoom = window.innerWidth > 900 ? 10.5 : 9;
        setTimeout(() => {
            showMarkers = true;
        }, 500);

        // Toggle map info display to closed state
        const infoEl = document.querySelector('.maplibregl-ctrl-attrib');
        if (infoEl) {
            infoEl.classList.remove('maplibregl-compact-show');
            infoEl.attributes.removeNamedItem('open');
        }
    })

    const today = dayjs();

    const setCenter = (lat: number, lng: number) => {
        center = { lat, lng };
    }
</script>

<!-- style="/map-dark.json" -->
<MapLibre
    style="https://tiles.openfreemap.org/styles/positron"
    class="w-full h-full"
    {center}
    {zoom}
    {minZoom}
>
    <NavigationControl position="top-right" />
    {#if showMarkers}
        {#each $DisplayedSales as sale, index (sale.id)}
            {#if sale.type === "permanent"}
                <PermenantMarker {sale} {setCenter} {today} {index} />
            {:else}
                <SalesMarker {sale} {setCenter} {today} {index} />
            {/if}
        {/each}
    {/if}
</MapLibre>

{#if !$DisplayedSales.length && ($Filters.onlyActive || $Filters.type || $Filters.tags.length)}
    <div class="absolute top-1/2 left-1/2 z-10 w-3/4 max-w-96 -translate-x-1/2 -translate-y-1/2
        rounded-lg bg-white/90 p-6 text-center shadow-lg backdrop-blur-sm">
        <h2 class="mb-4 text-2xl font-semibold">No sales found</h2>
        <p class="mb-4">Try adjusting your filter options to see more sales.</p>
    </div>
{/if}