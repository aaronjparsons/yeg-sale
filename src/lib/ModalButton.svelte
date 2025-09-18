<script lang="ts">
    import { createDialog, melt } from "@melt-ui/svelte";
    import { fade, fly } from "svelte/transition";

    const { title, buttonContent, modal, round = false } = $props();

    const {
        elements: {
            trigger,
            overlay,
            content,
            close,
            portalled,
        },
        states: { open },
    } = createDialog({
        forceVisible: true,
    });
</script>

<button
    use:melt={$trigger}
    class="flex items-center"
    class:primary-button={!round}
    class:round-button={round}
>
    {@render buttonContent()}
</button>

{#if $open}
    <div class="" use:melt={$portalled}>
        <div
            use:melt={$overlay}
            class="fixed inset-0 z-50 bg-black/50"
            transition:fade={{ duration: 150 }}
        ></div>
        <div
            class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw]
                max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white
                p-4 pt-16 shadow-lg"
            transition:fly={{ y: 100 }}
            use:melt={$content}
        >
            <button
                use:melt={$close}
                aria-label="close"
                class="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none
                        items-center justify-center rounded-full p-1 text-xl font-semibold"
            >
                ✕
            </button>
            <h2 class="absolute left-4 top-3 text-2xl font-semibold">{title}</h2>
            {@render modal({ open })}
        </div>
    </div>
{/if}
