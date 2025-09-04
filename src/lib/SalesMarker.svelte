<script lang="ts">
    import dayjs from '$lib/dayjs';
    import type { Dayjs } from 'dayjs';
    import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
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

    const modalStore = getModalStore();

    const deleteSale = async (id: number) => {
        const modal: ModalSettings = {
            type: 'component',
            component: 'deleteConfirmModal',
            meta: {
                id,
                onDelete: () => {
                    Sales.update(sales => sales.filter(s => s.id !== id) );
                }
            }
        };
        modalStore.trigger(modal);
    }
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
                            <span class="chip variant-filled">{tag}</span>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if sale.owned}
                <div class="flex justify-end gap-2">
                    <button onclick={() => deleteSale(sale.id)} class="btn btn-sm variant-filled-error">
                        Delete
                    </button>
                </div>
            {/if}
        </div>
    </Popup>
</Marker>