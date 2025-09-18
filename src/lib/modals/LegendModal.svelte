<script lang="ts">
    import MapMarker from '$lib/Marker.svelte';
    import { MARKERS } from '$lib/utils';
</script>

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