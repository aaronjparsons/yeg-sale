<script lang="ts">
    import { addToast } from '$lib/Toast.svelte'
    import { Sales } from '$lib/Store';

    const { sale, open } = $props();

    let submitting = $state(false);
    let selectedIssue = $state('');
    const issues = [
        'Incorrect address',
        'Incorrect dates',
        'Incorrect website',
        'Market no longer active',
    ];

    const handleDelete = async () => {
        submitting = true;
        const data = {
            marketId: sale.baseId,
            message: selectedIssue,
        }
        const response = await fetch('/reports/', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            addToast({
                data: {
                    title: 'Issue submitted',
                    description: 'Thank you',
                    color: 'bg-green-500',
                }
            })
            closeModal();
        } else {
            addToast({
                data: {
                    title: 'Error submitting issue',
                    description: 'Please try again',
                    color: 'bg-red-500',
                }
            })
        }
        submitting = false;
    }

    const closeModal = () => {
        $open = false;
    }
</script>

<div class="space-y-4">
    <div>
        <p class="font-semibold">Market:</p>
        <p class="mb-2">{sale.displayName}</p>
    </div>
    <label for="market-issue" class="label">
        <span class="label-text">Select issue</span>
        <select bind:value={selectedIssue} id="market-issue" class="primary-select w-full">
            {#each issues as issue}
                <option value={issue}>{issue}</option>
            {/each}
        </select>
    </label>
    <div class="flex justify-end">
        <button class="secondary-button mr-2" onclick={closeModal}>
            Cancel
        </button>
        <button
            class="rounded-xl bg-red-500 text-white px-4 py-3 leading-none hover:bg-red-400 transition-all duration-75 disabled:opacity-70 disabled:cursor-not-allowed;"
            disabled={!selectedIssue.length || submitting}
            onclick={handleDelete}
        >
            {submitting ? 'Submitting...' : 'Submit'}
        </button>
    </div>
</div>