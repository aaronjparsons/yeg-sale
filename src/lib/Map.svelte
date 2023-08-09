<script context="module" lang="ts">
    let map: google.maps.Map;
    let activeSale: Sale | null = null;

    export const addMarker = (sale: Sale) => {
        const marker = new google.maps.Marker({
            position: { lat: Number(sale.lat), lng: Number(sale.lng) },
            map: map,
            icon: sale.active ? 'green_marker.png' : 'yellow_marker.png'
        });
        const infowindow = new google.maps.InfoWindow({
            content: `
                <p><span class="text-lg font-semibold">Address: </span>${sale.address}</p>
                <p class="text-lg font-semibold">Days:</p>

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
            map.panTo(marker.getPosition());
        });
        marker.addListener('mouseover', () => {
            console.log(isActiveSale(sale))
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
    }

    const isActiveSale = (sale: Sale) => {
        return activeSale?.id === sale.id
    }
</script>

<script lang="ts">
    import { Loader } from '@googlemaps/js-api-loader';
    import { onMount } from 'svelte';
    import { sale } from '$lib/Store';

    export let data: Sale[] = [];

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
                zoom: 12,
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
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

            // ---- Markers ----
            for (const sale of data) {
                addMarker(sale);
            }

            // ---- Search ----
            // Create a bounding box with sides ~10km away from the center point
            const defaultBounds = {
                north: center.lat + 0.1,
                south: center.lat - 0.1,
                east: center.lng + 0.1,
                west: center.lng - 0.1,
            };
            const input = document.getElementById("pac-input") as HTMLInputElement;
            const options = {
                bounds: defaultBounds,
                componentRestrictions: { country: 'ca' },
                fields: ['formatted_address', 'geometry'],
            };

            const autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener('place_changed', async () => {
                const place = autocomplete.getPlace();
                const formattedAddr = place.formatted_address?.replace(/\s[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d/, '');

                const data = {
                    address: formattedAddr,
                    lat: place.geometry?.location?.lat(),
                    lng: place.geometry?.location?.lng(),
                }

                sale.setAddress(data);
            })
        });
    })
</script>

<div bind:this={mapEl} class="h-full w-full"></div>