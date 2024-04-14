<script lang="ts">
    import { onMount, createEventDispatcher, onDestroy } from 'svelte';
    import { getModalStore, Stepper, Step, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
    import dayjs from '$lib/dayjs';
    import { sale } from '$lib/Store';
    import { addMarker } from './Map.svelte';
    import { TAGS, SALE_TYPES } from './utils';
  import { slide } from 'svelte/transition';

    let loading = false;
    const modalStore = getModalStore();
    const toastStore = getToastStore();
    let hasSomeErrors = false;

    $: if ($sale.days) {
        hasSomeErrors = false;
        for (let i = 0; i < $sale.days.length; i++) {
            const day = $sale.days[i];
            day.errors = [false, false, false];

            // Check that day is not before the previous day
            if (i > 0 && dayjs(day.date).isBefore(dayjs($sale.days[i - 1].date))) {
                day.errors[0] = true;
            }

            // Check that start time is not after end time
            if (day.startTime > day.endTime) {
                day.errors[1] = true;
            }
        }
        hasSomeErrors = $sale.days.flatMap(day => day.errors).some(err => err);
    }

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
            const dayString = day.date; //dayjs(day.date).format('YYYY-MM-DD');
            day.startTime = dayjs(`${dayString} ${day.startTime}`).toISOString();
            day.endTime = dayjs(`${dayString} ${day.endTime}`).toISOString();
            delete day.date;
            delete day.errors;
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
            let message = 'Sale successfully created';

            if (startTime.diff(today, 'days') <= 30) {
                // Is upcoming within 30 days, add it to data
                addMarker(newSale);
            } else {
                message = 'Sale was successfully created, but is currently hidden as it begins more than 30 days from now.'
            }

            const toast: ToastSettings = {
                message,
            };
            toastStore.trigger(toast);
            // Close modal
            closeModal();
        } else {
            const toast: ToastSettings = {
                message: 'Error creating sale',
                background: 'variant-filled-error',
            };
            toastStore.trigger(toast);
        }
        loading = false;
    }

    const getMinDate = (index: number) => {
        if (index > 0) {
            return dayjs($sale.days[index - 1].date).add(1, 'day').format('YYYY-MM-DD');
        } else {
            return dayjs().format('YYYY-MM-DD');
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
                    {#each Object.entries(SALE_TYPES) as [key, value]}
                        <option value={key}>{value}</option>
                    {/each}
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
        <Step locked={hasSomeErrors}>
            <svelte:fragment slot="header">Days and time</svelte:fragment>
            <div class="overflow-x-auto">
                {#each $sale.days as day, index (index)}
                    <div class="flex items-center space-x-4 mb-2">
                        <div class="flex-grow">
                            {#if index === 0}
                                <label for="day" class="label">
                                    <span class="label-text">Day</span>
                                </label>
                            {/if}
                            <input
                                bind:value={day.date}
                                class="date-input input input-bordered p-2 {day.errors[0] ? 'input-error' : ''}"
                                type="date"
                                min={getMinDate(index)}
                                max={dayjs().add(1, 'years').format('YYYY-MM-DD')}
                            />
                        </div>
                        <div class="flex-grow">
                            {#if index === 0}
                                <label for="start-time" class="label">
                                    <span class="label-text">Start time</span>
                                </label>
                            {/if}
                            <input
                                bind:value={day.startTime}
                                class="input input-bordered p-2 {day.errors[1] ? 'input-error' : ''}"
                                type="time"
                                max={day.endTime}
                            />
                        </div>
                        <div class="flex-grow">
                            {#if index === 0}
                                <label for="end-time" class="label">
                                    <span class="label-text">End time</span>
                                </label>
                            {/if}
                            <input
                                bind:value={day.endTime}
                                class="input input-bordered p-2 {day.errors[2] ? 'input-error' : ''}"
                                type="time"
                                min={day.startTime}
                            />
                        </div>
                        {#if index > 0}
                            <div class="flex-shrink-0">
                                <button
                                    class="btn-icon btn-icon-sm variant-filled-error text-white"
                                    on:click={() => sale.removeDay(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        {:else}
                            <span class="w-[33px]"></span>
                        {/if}
                    </div>
                {/each}
            </div>
            <button class="btn btn-sm variant-filled w-full" on:click|preventDefault={sale.addDay}>+ Add another day</button>
            {#if hasSomeErrors}
                <aside class="alert variant-ghost-error" transition:slide|local={{ duration: 200 }}>
                    Please ensure days are in order, and all start times are before their end times.
                </aside>
            {/if}
        </Step>
        <Step locked={loading || !$sale.tags.length}>
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
