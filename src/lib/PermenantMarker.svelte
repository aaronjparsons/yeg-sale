<script lang="ts">
    import { Marker, Popup } from 'svelte-maplibre';
    import type { Dayjs } from 'dayjs';
    import MapMarker from '$lib/Marker.svelte';
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
    </div>
    </Popup>
</Marker>