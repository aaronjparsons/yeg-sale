<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    import MapMarker from '$lib/Marker.svelte';
    import { MARKERS } from '$lib/utils';

    const modalStore = getModalStore();

    const closeModal = () => {
        modalStore.close();
    }
</script>

<div class="relative card w-modal p-4 shadow-lg">
    <div class="flex justify-between mb-4">
        <p class="font-semibold text-2xl">Legend</p>
        <button class="btn-icon btn-icon-sm" onclick={closeModal}>
            ✕
        </button>
    </div>
    <div class="space-y-4">
        <div>
            <div class="flex flex-col gap-2">
                <div class="flex items-center">
                    <MapMarker color={MARKERS.active.color} animate={false} />
                    <p class="ml-1">Sales active today</p>
                </div>
                <div class="flex items-center">
                    <MapMarker color={MARKERS.upcoming.color} animate={false} />
                    <p class="ml-1">Upcoming sales<span class="ml-1 text-sm text-gray-700">(within the next 30 days)</span></p>
                </div>
                <div class="flex items-center">
                    <MapMarker color={MARKERS.permanent.color} letter={MARKERS.permanent.letter} animate={false} />
                    <p class="ml-1">Farmers' markets</p>
                </div>
            </div>
        </div>
    </div>
</div>