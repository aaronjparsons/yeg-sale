<script context="module" lang="ts">
    import dayjs from '$lib/dayjs';
    import { SALE_TYPES } from './utils';

    let map: google.maps.Map;
    let activeSale: Sale | null = null;
    const markers = {};

    export const addMarker = (sale: Sale) => {
        const marker = new google.maps.Marker({
            position: { lat: Number(sale.lat), lng: Number(sale.lng) },
            map: map,
            icon: sale.active ? 'green_marker.png' : 'yellow_marker.png'
        });

        const today = dayjs();
        const daysEls = sale.days.map((day: Day) => {
            const start = dayjs(day.startTime);
            const end = dayjs(day.endTime);
            const classString = today.isSame(start, 'day') ? 'font-semibold' : '';
            return `<p class="${classString}">${start.format('MMM D')}, ${start.format('h:mm a')} - ${end.format('h:mm a')}</p>`;
        })
        const categories = sale.tags.split(',').map((category: string) => {
            return `<span class="chip variant-filled">${category}</span>`;
        })
        const infowindow = new google.maps.InfoWindow({
            content: `
                <p class="text-lg font-semibold mb-4">${SALE_TYPES[sale.type]}</p>
                <div class="space-y-2 text-base">
                    <div>
                        <p class="font-semibold mr-1">Address: </p>
                        <p class="ml-5">${sale.address}</p>
                    </div>

                    <div>
                        <p class="font-semibold mr-1">Days:</p>
                        <div class="ml-5">
                            ${daysEls.join('')}
                        </div>
                    </div>

                    ${sale.tags.length
                        ? `
                            <div>
                                <p class="font-semibold mr-1">Categories:</p>
                                <div class="flex flex-wrap gap-2 ml-5 max-w-[400px]">${categories.join('')}</div>
                            </div>
                        `
                        : ''
                    }

                    ${sale.owned
                        ? `
                            <div class="flex justify-end gap-2">
                                <button onclick="deleteSale(${sale.id})" class="btn btn-sm variant-filled-error">Delete</button>
                            </div>
                        `
                        : ''
                    }
                </div>
            `,
        });
        infowindow.addListener('closeclick', ()=>{
            if (isActiveSale(sale)) {
                activeSale = null;
            }
        });
        sale.infowindow = infowindow;

        marker.addListener('click', () => {
            // Close active window if there is one
            if (activeSale) {
                activeSale.infowindow?.close();
                activeSale = null;
            }

            infowindow.open(map, marker);
            activeSale = sale;
            map.panToWithOffset(marker.getPosition(), 0, -200);
        });
        marker.addListener('mouseover', () => {
            if (isActiveSale(sale)) {
                return;
            }
            infowindow.open(map, marker);
        })
        marker.addListener('mouseout', () => {
            if (isActiveSale(sale)) {
                return;
            }
            infowindow.close();
        })

        markers[sale.id] = marker;
    }

    const isActiveSale = (sale: Sale) => {
        return activeSale?.id === sale.id
    }
</script>

<script lang="ts">
    import { Loader } from '@googlemaps/js-api-loader';
    import { onMount, getContext } from 'svelte';
    import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
    import { sale } from '$lib/Store';

    const { sales } = getContext('APP');
    const toastStore = getToastStore();
    let mapEl : HTMLElement;

    onMount(() => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_MAPS_API_KEY,
            version: "weekly",
            libraries: ["places"]
        });
        const center = { lat: 53.5461, lng: -113.4938 };

        loader.load().then(() => {
            // ---- Map ----
            map = new google.maps.Map(mapEl, {
                center,
                zoom: window.innerWidth > 900 ? 12 : 10,
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT,
                },
                clickableIcons: false,
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [
                            { visibility: 'off' }
                        ]
                    }
                ]
            });

            // ------ Add pan with offset method
            map.panToWithOffset = function(latlng: google.maps.LatLng, offsetX = 0, offsetY = 0) {
                const map = this;
                const ov = new google.maps.OverlayView();
                ov.onAdd = function() {
                    const proj = this.getProjection();
                    const aPoint: google.maps.Point = proj.fromLatLngToContainerPixel(latlng);
                    aPoint.x = aPoint.x + offsetX;
                    aPoint.y = aPoint.y + offsetY;
                    map.panTo(proj.fromContainerPixelToLatLng(aPoint));
                };
                ov.draw = function() {};
                ov.setMap(this);
            };

            // ---- Markers ----
            for (const sale of sales) {
                addMarker(sale);
            }
        });

        window.deleteSale = async (id: number, marker: any) => {
            console.warn(id, markers);

            const response = await fetch(`/sales/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const marker = markers[id];
                marker.setMap(null);
                const toast: ToastSettings = {
                    message: 'Sale deleted',
                };
                toastStore.trigger(toast);
            } else {
                const toast: ToastSettings = {
                    message: 'Error deleting sale',
                    background: 'variant-filled-error',
                };
                toastStore.trigger(toast);
            }
        }
    })
</script>

<div
    bind:this={mapEl}
    class="h-full w-full"
></div>