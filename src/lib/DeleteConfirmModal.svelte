<script lang="ts">
    import { getToastStore, getModalStore, type ToastSettings } from '@skeletonlabs/skeleton';

    const modalStore = getModalStore();
    const toastStore = getToastStore();
    let deleting = $state(false);

    const handleDelete = async () => {
        deleting = true;
        const id = $modalStore[0].meta.id;
        const response = await fetch(`/sales/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const toast: ToastSettings = {
                message: 'Sale deleted',
            };
            toastStore.trigger(toast);
            $modalStore[0].meta.onDelete();
            closeModal();
        } else {
            const toast: ToastSettings = {
                message: 'Error deleting sale',
                background: 'variant-filled-error',
            };
            toastStore.trigger(toast);
        }
        deleting = false;
    }

    const closeModal = () => {
        modalStore.close();
    }
</script>

<div class="relative card w-modal p-4 shadow-lg">
    <div class="flex justify-between mb-4">
        <p class="font-semibold text-2xl">Confirm delete</p>
        <button class="btn-icon btn-icon-sm" onclick={closeModal}>
            ✕
        </button>
    </div>
    <div class="space-y-4">
        <p>Are you sure you want to delete this sale?</p>
        <div class="flex justify-end">
            <button class="btn variant-filled-error mr-2" disabled={deleting} onclick={handleDelete}>
                {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button class="btn variant-filled" onclick={closeModal}>
                Cancel
            </button>
        </div>
    </div>
</div>