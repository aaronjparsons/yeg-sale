<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { fly } from 'svelte/transition';
    import { createCombobox, melt } from '@melt-ui/svelte';
    import dayjs from '$lib/dayjs';
    import { addToast } from '$lib/Toast.svelte'
    import { sale, Sales } from '$lib/Store';
    import { TAGS, SALE_TYPES } from './utils';
    import { slide } from 'svelte/transition';

    const { open } = $props();

    let loading = $state(false);
    let hasSomeErrors = $state(false);
    let addressOptions = $state([]);
    let searchState = $state<'idle' | 'searching' | 'done' | 'error'>('idle');
    let stepIndex = $state(0);
    let daysEl = $state<HTMLElement|undefined>(undefined);

    const {
        elements: { menu, input, option, label },
        states: { open: comboboxOpen, inputValue, touchedInput, selected },
        helpers: { isSelected },
    } = createCombobox({
        forceVisible: true,
        onSelectedChange: ({ curr, next }) => {
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
            let message = '';

            if (startTime.diff(today, 'days') <= 30) {
                // Is upcoming within 30 days, add it to data
                Sales.update(sales => {
                    return [newSale, ...sales];
                });
            } else {
                message = 'Sale is currently hidden as it begins more than 30 days from now.'
            }

            addToast({
                data: {
                    title: 'Sale created',
                    description: message,
                    color: 'bg-green-500',
                }
            })
            // Close modal
            $open = false;
        } else {
            addToast({
                data: {
                    title: 'Error creating sale',
                    description: '',
                    color: 'bg-red-500',
                }
            })
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

    const addDay = async () => {
        sale.addDay();
        await tick();
        daysEl.scrollTo({
            top: daysEl.scrollHeight,
            behavior: "smooth"
        });
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
        if (!$comboboxOpen && $selected) {
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

{#if stepIndex === 0}
    <p class="text-lg font-semibold mb-2">Add your upcoming sale to the map!</p>
    <label for="sale-type" class="label">
        <span class="label-text">Sale Type</span>
        <select bind:value={$sale.type} id="sale-type" class="primary-select w-full">
            {#each Object.entries(SALE_TYPES) as [key, value]}
                <option value={key}>{value}</option>
            {/each}
        </select>
    </label>
    <label for="pac-input" class="label">
        <span class="label-text">Address</span>
        <input
            use:melt={$input}
            class="primary-select w-full p-2 {touchedInput && !inputValue ? 'input-error' : ''}"
            placeholder="Start typing an address"
        />
    </label>
    {#if $comboboxOpen && addressOptions.length}
        <ul
            class="flex max-h-[300px] flex-col overflow-hidden shadow-md rounded-lg border border-primary"
            style="z-index: 1200;"
            use:melt={$menu}
            transition:fly={{ duration: 150, y: -5 }}
        >
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
                class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white text-black"
                tabindex="0"
            >
                {#each addressOptions as address, index (index)}
                    <li
                        use:melt={$option({
                            value: address.placeId,
                            label: address.text,
                        })}
                        class="text-sm cursor-pointer scroll-my-2 py-1 px-2 data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900"
                        class:bg-gray-300={$isSelected(address.placeId)}
                    >
                        <span>{address.text}</span>
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
    <div class="flex justify-between mt-6">
        <button
            class="secondary-button"
            onclick={() => $open = false}
        >
            Cancel
        </button>
        <button
            class="primary-button"
            disabled={!Boolean($sale.address.length)}
            onclick={() => stepIndex = 1}
        >
            Next
        </button>
    </div>
{:else if stepIndex === 1}
    <p class="text-lg font-semibold mb-2">Days and time</p>
    <div bind:this={daysEl} class="overflow-auto max-h-56">
        {#each $sale.days as day, index (index)}
            <div class="flex items-center space-x-2 mb-2">
                <div class="relative">
                    {#if index === 0}
                        <label for="day" class="block">
                            <span class="label-text">Day</span>
                        </label>
                    {/if}
                    <input
                        bind:value={day.date}
                        class="primary-select sm:max-w-full max-w-28 p-2 {day.errors[0] ? 'input-error' : ''}"
                        type="date"
                        min={getMinDate(index)}
                        max={dayjs().add(1, 'years').format('YYYY-MM-DD')}
                    />
                </div>
                <div class="relative w-24">
                    {#if index === 0}
                        <label for="start-time" class="block">
                            <span class="label-text">Start time</span>
                        </label>
                    {/if}
                    <input
                        bind:value={day.startTime}
                        class="primary-select w-full p-2 {day.errors[1] ? 'input-error' : ''}"
                        type="time"
                        max={day.endTime}
                    />
                </div>
                <div class="relative w-24">
                    {#if index === 0}
                        <label for="end-time" class="block">
                            <span class="label-text">End time</span>
                        </label>
                    {/if}
                    <input
                        bind:value={day.endTime}
                        class="primary-select w-full p-2 {day.errors[2] ? 'input-error' : ''}"
                        type="time"
                        min={day.startTime}
                    />
                </div>
                {#if index > 0}
                    <div class="flex-shrink-0">
                        <button
                            class="w-6 h-6 rounded-full bg-red-500 text-white"
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
    <button class="primary-button w-full text-sm" onclick={addDay}>+ Add another day</button>
    {#if hasSomeErrors}
        <aside class="mt-2 p-4 rounded-md border border-red-500 bg-red-100" transition:slide|local={{ duration: 200 }}>
            Please ensure days are in order, and all start times are before their end times.
        </aside>
    {/if}
    <div class="flex justify-between mt-6">
        <button
            class="secondary-button"
            onclick={() => stepIndex = 0}
        >
            Back
        </button>
        <button
            class="primary-button"
            disabled={hasSomeErrors}
            onclick={() => stepIndex = 2}
        >
            Next
        </button>
    </div>
{:else}
    <p class="text-lg font-semibold mb-2">Add categories</p>
    <div class="flex flex-wrap gap-2">
        {#each TAGS as tag}
            <span
                class="{$sale.tags.includes(tag) ? 'bg-primary text-white' : 'bg-gray-200'} text-xs rounded py-1 px-2 cursor-pointer"
                onclick={() => handleTagClicked(tag)}
            >
                {tag}
            </span>
        {/each}
    </div>
    <div class="flex justify-between mt-6">
        <button
            class="secondary-button"
            onclick={() => stepIndex = 1}
        >
            Back
        </button>
        <button
            class="primary-button"
            disabled={loading || !$sale.tags.length}
            onclick={onCompleteHandler}
        >
            { loading ? 'Creating...' : 'Create sale' }
        </button>
    </div>
{/if}
