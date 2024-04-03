<script context="module" lang="ts">
    import { get } from 'svelte/store';
    import dayjs from '$lib/dayjs';
    import { Filters } from '$lib/Store';
    import { MARKERS, SALE_TYPES, hasIntersection } from './utils';

    let map: google.maps.Map;
    let activeSale: Sale | null = null;
    const markers = {};

    const buildPermanentSaleInfowindow = (sale: Market) => {
        const today = dayjs().format('dddd');
        const daysEls = sale.days.split(',').map((day: string) => {
            const classString = day.includes(today) ? 'font-semibold' : '';
            return `<p class="${classString}">${day}</p>`;
        })
        const openEls = sale.open.split(',').map((open: string) => {
            return `<p class="ml-5">${open}</p>`;
        })
        const infowindow = new google.maps.InfoWindow({
            content: `
                <p class="text-lg font-semibold mb-4">${sale.displayName}</p>
                <div class="space-y-2 text-base">
                    <div>
                        <p class="font-semibold mr-1">Address: </p>
                        <p class="ml-5">${sale.address}</p>
                    </div>
                    <div>
                        <p class="font-semibold mr-1">Website: </p>
                        <a class="ml-5 text-blue-600 visited:text-purple-600" href=${sale.link} target="_blank">${sale.link}</a>
                    </div>
                    <div>
                        <p class="font-semibold mr-1">Open: </p>
                        ${openEls.join('')}
                        ${sale.open !== 'All year'
                            ? `<p class="ml-5 italic text-xs">
                                * Check website for exact start & end dates
                            </p>`
                            : ''
                        }
                    </div>
                    <div>
                        <p class="font-semibold mr-1">Days:</p>
                        <div class="ml-5">
                            ${daysEls.join('')}
                        </div>
                    </div>
                </div>
            `,
        });
        infowindow.addListener('closeclick', ()=>{
            if (isActiveSale(sale)) {
                activeSale = null;
            }
        });

        return infowindow;
    }

    const buildCustomSaleInfowindow = (sale: Sale) => {
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

        return infowindow;
    }

    export const filterMapMarkers = () => {
        const filters = get(Filters);
        for (const marker of Object.values(markers)) {
            // Active
            if (filters.onlyActive && !marker.sale.active) {
                marker.setMap(null);
                continue;
            }

            // Type
            if (filters.type) {// && marker.sale.type !== filters.type) {
                if (filters.type === 'market' && (marker.sale.type === 'market' || marker.sale.type === 'permanent')) {
                    // Do nothing
                } else if (marker.sale.type !== filters.type) {
                    marker.setMap(null);
                    continue;
                }
            }

            // Tags
            if (filters.tags.length) {
                if (!marker.sale.tags) {
                    marker.setMap(null);
                    continue;
                }

                const saleTags = marker.sale.tags.split(',');
                if (!hasIntersection(saleTags, filters.tags)) {
                    marker.setMap(null);
                    continue;
                }
            }

            // Matches filters, make sure map is set
            marker.setMap(map);
        }
    }

    export const resetMapMarkers = () => {
        for (const marker of Object.values(markers)) {
            marker.setMap(map);
        }
    }

    export const addMarker = (sale: Sale) => {
        let icon = sale.type === 'permanent'
                ? MARKERS.permanent
                : sale.active ? MARKERS.active : MARKERS.upcoming
        icon = {
            ...icon,
            anchor: new google.maps.Point(0, 20)
        };

        const marker = new google.maps.Marker({
            position: { lat: Number(sale.lat), lng: Number(sale.lng) },
            map: map,
            icon
        });
        marker.sale = sale;

        const infowindow = sale.type === 'permanent'
            ? buildPermanentSaleInfowindow(sale)
            : buildCustomSaleInfowindow(sale);

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
    import { onMount } from 'svelte';
    import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { Sales } from '$lib/Store';

    const modalStore = getModalStore();
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
                minZoom: 8,
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
            for (const sale of $Sales) {
                addMarker(sale);
            }
        });

        window.deleteSale = async (id: number, marker: any) => {
            const modal: ModalSettings = {
                type: 'component',
                component: 'deleteConfirmModal',
                meta: {
                    id,
                    onDelete: () => {
                        markers[id].setMap(null);
                    }
                }
            };
            modalStore.trigger(modal);
        }
    })
</script>

<div
    bind:this={mapEl}
    class="h-full w-full"
></div>