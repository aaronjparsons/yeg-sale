<script lang="ts">
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { createCombobox, melt } from '@melt-ui/svelte';
    import { getModalStore, Stepper, Step, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
    import dayjs from '$lib/dayjs';
    import { sale, Sales } from '$lib/Store';
    import { TAGS, SALE_TYPES } from './utils';
    import { slide } from 'svelte/transition';

    let loading = $state(false);
    const modalStore = getModalStore();
    const toastStore = getToastStore();
    let hasSomeErrors = $state(false);
    let addressOptions = $state([]);
    let searchState = $state<'idle' | 'searching' | 'done' | 'error'>('idle');

    const {
        elements: { menu, input, option, label },
        states: { open, inputValue, touchedInput, selected },
        helpers: { isSelected },
    } = createCombobox({
        forceVisible: true,
        onSelectedChange: ({ curr, next }) => {
            console.log('Selected changed:', { curr, next });
            if (next?.value && next.value !== curr?.value) {
                fetchAndSetAddress(next);
            }
            return next;
        }
    });

    let debounceTimer: ReturnType<typeof setTimeout>;

    const debounce = (callback: () => void) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(callback, 450);
    };

    const fetchAndSetAddress = async (address: any) => {
        const response = await fetch(`/places/${address.value}`, {
            method: 'GET',
        });
        if (response.ok) {
            const result = await response.json();
            sale.setAddress({
                address: address.label,
                lat: result.location.latitude,
                lng: result.location.longitude,
            });
        }
        console.warn($sale)
    }

    onMount(() => {
        sale.reset();
    });

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
                Sales.update(sales => {
                    return [newSale, ...sales];
                });
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

    $effect(() => {
        if (!$open && $selected) {
            $inputValue = $selected?.label ?? '';
        }
    });

    $effect(() => {
        if ($inputValue && $inputValue.length > 2) {
            if ($inputValue === $selected?.label) {
                return;
            }
            debounce(async () => {
                searchState = 'searching';
                const response = await fetch(`/places`, {
                    method: 'POST',
                    body: JSON.stringify({ input: $inputValue })
                });
                if (response.ok) {
                    const results = await response.json();
                    addressOptions = results;
                    searchState = 'done';
                } else {
                    addressOptions = [];
                    searchState = 'error';
                }
            });
        } else {
            addressOptions = [];
            searchState = 'idle';
        }
    });

    $effect(() => {
        if ($sale.days) {
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
    })
</script>

<div class="relative card w-modal p-4 shadow-lg">
    <div class="flex justify-end">
        <button class="btn-icon btn-icon-sm" onclick={closeModal}>
            ✕
        </button>
    </div>

    <Stepper on:complete={onCompleteHandler}>
        <Step locked={!Boolean($sale.address.length)}>
            {#snippet header()}
            Add your upcoming sale to the map!
          {/snippet}
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
                    use:melt={$input}
                    class="select select-bordered w-full p-2 {touchedInput && !inputValue ? 'input-error' : ''}"
                    placeholder="Address"
                />
            </label>
            {#if $open}
                <ul
                    class="flex max-h-[300px] flex-col overflow-hidden rounded-lg"
                    style="z-index: 1200;"
                    use:melt={$menu}
                    transition:fly={{ duration: 150, y: -5 }}
                >
                    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                    <div
                        class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black"
                        tabindex="0"
                    >
                        {#each addressOptions as address, index (index)}
                            <li
                                use:melt={$option({
                                    value: address.placeId,
                                    label: address.text,
                                })}
                                class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4 data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900"
                            >
                                {#if $isSelected(address)}
                                    <div class="check absolute left-2 top-1/2 z-10 text-magnum-900">
                                    </div>
                                {/if}
                                <div class="pl-4">
                                    <span class="font-medium">{address.text}</span>
                                </div>
                            </li>
                        {:else}
                            {#if searchState === 'searching'}
                                <li
                                    class="relative rounded-md p-2 text-gray-500"
                                >
                                    Searching...
                                </li>
                            {:else}
                                <li
                                    class="relative rounded-md p-2 text-gray-500"
                                >
                                    {searchState === 'done' ? 'No results found' : 'Type in an address...'}
                                </li>
                            {/if}
                        {/each}
                    </div>
                </ul>
            {/if}
        </Step>
        <Step locked={hasSomeErrors}>
            {#snippet header()}
            Days and time
          {/snippet}
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
                                    onclick={() => sale.removeDay(index)}
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
            <button class="btn btn-sm variant-filled w-full" onclick={sale.addDay}>+ Add another day</button>
            {#if hasSomeErrors}
                <aside class="alert variant-ghost-error" transition:slide|local={{ duration: 200 }}>
                    Please ensure days are in order, and all start times are before their end times.
                </aside>
            {/if}
        </Step>
        <Step locked={loading || !$sale.tags.length}>
            {#snippet header()}
            Add categories
          {/snippet}
            <div class="flex flex-wrap gap-2">
                {#each TAGS as tag}
                    <span
                        class="chip {$sale.tags.includes(tag) ? 'variant-filled' : 'variant-ghost'}"
                        onclick={() => handleTagClicked(tag)}
                    >
                        {tag}
                    </span>
                {/each}
            </div>
        </Step>
    </Stepper>
</div>
