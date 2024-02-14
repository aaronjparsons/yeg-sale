<script lang="ts">
    import { onMount, createEventDispatcher, onDestroy } from 'svelte';
    import { getModalStore, Stepper, Step } from '@skeletonlabs/skeleton';
    import { DateInput } from 'date-picker-svelte'
    import dayjs from '$lib/dayjs';
    import { sale } from '$lib/Store';
    import TimeSelect from '$lib/TimeSelect.svelte'
    import { addMarker } from './Map.svelte';
    import { TAGS } from './utils';

    let loading = false;
    const modalStore = getModalStore();

    onMount(() => {
        sale.reset();
        const center = { lat: 53.5461, lng: -113.4938 };
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

    onDestroy(() => {
        const pacContainer = document.querySelector('.pac-container');
        if (pacContainer) {
            pacContainer.remove();
        }
    })

    const createNewSale = async () => {
        loading = true;
        const data = { ...$sale };
        for (const day of data.days) {
            const dayString = dayjs(day.date).format('YYYY-MM-DD');
            day.startTime = dayjs(`${dayString} ${day.startTime}`).toISOString();
            day.endTime = dayjs(`${dayString} ${day.endTime}`).toISOString();
            delete day.date;
        }

        // Convert tags to comma separated string
        data.tags = data.tags.join(',');

        const response = await fetch('/sales', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const newSale = await response.json() as Sale;

            // Check if newSale falls within the upcoming days constraint
            const today = dayjs();
            const startTime = dayjs(newSale.days[0].startTime);
            if (today.diff(startTime, 'days') <= 7) {
                // Is upcoming within 7 days, add it to data
                addMarker(newSale);
            }
            // TODO: Success msg
            // Close modal
            closeModal();
        } else {
            // TODO: Handle error
        }
        loading = false;
    }

    const getMinDate = (index: number) => {
        if (index > 0) {
            return dayjs($sale.days[index - 1].date).add(1, 'day').format('YYYY-MM-DD');
        } else {
            return '';
        }
    }

    const handleTagClicked = (tag: string) => {
        const tagIndex = $sale.tags.indexOf(tag);
        if (tagIndex === -1) {
            $sale.tags = [...$sale.tags, tag];
        } else {
            $sale.tags.splice(tagIndex, 1);
            $sale.tags = $sale.tags;
        }
        console.log($sale)
    }

    const onCompleteHandler = () => {
        createNewSale();
    }

    const closeModal = () => {
        modalStore.close();
    }
</script>

<div class="relative card w-modal p-4 shadow-lg">
    <div class="flex justify-end">
        <button class="btn-icon btn-icon-sm" on:click={closeModal}>
            ✕
        </button>
    </div>

    <Stepper on:complete={onCompleteHandler}>
        <Step locked={!Boolean($sale.address.length)}>
            <svelte:fragment slot="header">Add your upcoming sale to the map!</svelte:fragment>
            <label for="sale-type" class="label">
                <span class="label-text">Sale Type</span>
                <select bind:value={$sale.type} id="sale-type" class="select select-bordered w-full">
                    <option value="yard">Yard Sale</option>
                    <option value="garage">Garage Sale</option>
                    <option value="estate">Estate Sale</option>
                    <option value="antique">Antique Sale</option>
                </select>
            </label>
            <label for="pac-input" class="label">
                <span class="label-text">Address</span>
                <input
                    id="pac-input"
                    type="text"
                    placeholder="Enter an address"
                    class="input input-bordered p-2"
                    required
                />
            </label>
        </Step>
        <Step>
            <svelte:fragment slot="header">Days and time</svelte:fragment>
            {#each $sale.days as day, index}
                <div class="flex items-center space-x-4 mb-2">
                    <div class="flex-grow">
                        {#if index === 0}
                            <label for="day" class="label">
                                <span class="label-text">Day</span>
                            </label>
                        {/if}
                        <DateInput bind:value={day.date} format="dd-MM-yyyy" />
                    </div>
                    <div class="flex-grow">
                        {#if index === 0}
                            <label for="start-time" class="label">
                                <span class="label-text">Start time</span>
                            </label>
                        {/if}
                        <TimeSelect bind:value={day.startTime} max={day.endTime} />
                    </div>
                    <div class="flex-grow">
                        {#if index === 0}
                            <label for="end-time" class="label">
                                <span class="label-text">End time</span>
                            </label>
                        {/if}
                        <TimeSelect bind:value={day.endTime} min={day.startTime} />
                    </div>
                    {#if index > 0}
                        <button
                            class="btn-icon btn-icon-sm variant-filled-error text-white"
                            on:click={() => sale.removeDay(index)}
                        >
                            ✕
                        </button>
                    {:else}
                        <span class="w-[33px]"></span>
                    {/if}
                </div>
            {/each}
            <button class="btn btn-sm variant-filled w-full" on:click|preventDefault={sale.addDay}>+ Add another day</button>
        </Step>
        <Step locked={loading}>
            <svelte:fragment slot="header">Add categories</svelte:fragment>
            <div class="flex flex-wrap gap-2">
                {#each TAGS as tag}
                    <span
                        class="chip {$sale.tags.includes(tag) ? 'variant-filled' : 'variant-ghost'}"
                        on:click={() => handleTagClicked(tag)}
                    >
                        {tag}
                    </span>
                {/each}
            </div>
        </Step>
    </Stepper>
</div>
