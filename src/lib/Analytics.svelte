<script lang="ts">
    import { page } from '$app/state'

    $effect(() => {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'G-PP096K34HN', {
                page_title: document.title,
                page_path: page.url.pathname,
            })
        }
    });
</script>

<svelte:head>
    <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-PP096K34HN">
    </script>
    <script>
        window.dataLayer = window.dataLayer || []

        function gtag() {
            dataLayer.push(arguments)
        }

        gtag('js', new Date())
        gtag('config', 'G-PP096K34HN')
    </script>
</svelte:head>
