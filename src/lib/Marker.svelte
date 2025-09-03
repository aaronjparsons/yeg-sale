<script lang="ts">
    let {
        color = '',
        index,
        letter,
    } : {
        color: string,
        index: number,
        letter: string
    } = $props();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    class="marker w-10 h-12 {color}"
    style={`animation: dropIn 0.3s ease forwards ${index * 0.07}s;`}
>
    <path stroke="white" stroke-width=24 d="M320 64C214 64 128 148.4 128 252.6C128 371.9 248.2 514.9 298.4 569.4C310.2 582.2 329.8 582.2 341.6 569.4C391.8 514.9 512 371.9 512 252.6C512 148.4 426 64 320 64z"/>
    {#if letter}
        <text
            x="320"
            y="300"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="200"
            font-family="sans-serif"
            fill="white"
            font-weight="bold"
        >
            {letter}
        </text>
    {/if}
</svg>

