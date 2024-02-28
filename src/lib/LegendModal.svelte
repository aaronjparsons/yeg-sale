<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    import ActiveSVG from './ActiveSVG.svelte';
    import UpcomingSVG from './UpcomingSVG.svelte';
    import MarketSvg from './MarketSVG.svelte';

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
                    <ActiveSVG />
                    <p class="ml-1">Sales active today</p>
                </div>
                <div class="flex items-center">
                    <UpcomingSVG />
                    <p class="ml-1">Upcoming sales</p>
                </div>
                <div class="flex items-center">
                    <MarketSvg />
                    <p class="ml-1">Farmers' markets</p>
                </div>
            </div>
        </div>
    </div>
</div>