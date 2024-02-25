<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';

    const modalStore = getModalStore();

    const closeModal = () => {
        modalStore.close();
    }
</script>

<div class="relative card w-modal p-4 shadow-lg">
    <div class="flex justify-between mb-4">
        <p class="font-semibold text-2xl">Legend</p>
        <button class="btn-icon btn-icon-sm" on:click={closeModal}>
            ✕
        </button>
    </div>
    <div class="space-y-4">
        <div>
            <div class="flex flex-col gap-2">
                <div class="flex items-center">
                    <img class="h-6 mr-2" src="./green_marker.png" alt="Green map marker (active)" />
                    <p>Sales active today</p>
                </div>
                <div class="flex items-center">
                    <img class="h-6 mr-2" src="./yellow_marker.png" alt="Green map marker (active)" />
                    <p>Upcoming sales</p>
                </div>
            </div>
        </div>
    </div>
</div>