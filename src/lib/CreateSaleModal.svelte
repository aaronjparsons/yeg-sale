<script lang="ts">
    import { onMount } from "svelte";

    onMount(() => {
        // TODO: set up maps places search
    })
</script>

<div class="card w-modal p-4 shadow-lg">
    <h3 class="font-bold text-lg mb-4">Add your upcoming sale to the map!</h3>
    <label class="label">
        <span>Address</span>
        <input
            id="pac-input"
            class="input"
            type="text"
            placeholder="Enter an address"
            required
        />
    </label>
</div>