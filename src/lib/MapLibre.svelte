<script lang="ts">
    import dayjs from '$lib/dayjs';
    import { onMount } from 'svelte';
    import { MapLibre, NavigationControl } from 'svelte-maplibre';
    import PermenantMarker from '$lib/PermenantMarker.svelte';
    import SalesMarker from './SalesMarker.svelte';
    import { Sales } from '$lib/Store';

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
        console.warn($Sales, 'Sales data loaded from Store');
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
        {#each $Sales as sale, index}
            {#if sale.type === "permanent"}
                <PermenantMarker {sale} {setCenter} {today} {index} />
            {:else}
                <SalesMarker {sale} {setCenter} {today} {index} />
            {/if}
        {/each}
    {/if}
</MapLibre>