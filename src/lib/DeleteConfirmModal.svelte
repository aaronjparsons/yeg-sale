<script lang="ts">
    import { addToast } from '$lib/Toast.svelte'
    import { Sales } from '$lib/Store';

    const { id, open } = $props();

    let deleting = $state(false);

    const handleDelete = async () => {
        deleting = true;
        const response = await fetch(`/sales/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            addToast({
                data: {
                    title: 'Sale deleted',
                    description: '',
                    color: 'bg-green-500',
                }
            })
            Sales.update(sales => sales.filter(sale => sale.id !== id));
            closeModal();
        } else {
            addToast({
                data: {
                    title: 'Error deleting sale',
                    description: 'Please try again',
                    color: 'bg-red-500',
                }
            })
        }
        deleting = false;
    }

    const closeModal = () => {
        $open = false;
    }
</script>

<div class="space-y-4">
    <p>Are you sure you want to delete this sale?</p>
    <div class="flex justify-end">
        <button class="secondary-button mr-2" onclick={closeModal}>
            Cancel
        </button>
        <button
            class="rounded-xl bg-red-500 text-white px-4 py-3 leading-none hover:bg-red-400 transition-all duration-75 disabled:opacity-70 disabled:cursor-not-allowed;"
            disabled={deleting}
            onclick={handleDelete}
        >
            {deleting ? 'Deleting...' : 'Delete'}
        </button>
    </div>
</div>