export const GET = async ({ params }) => {
    try {
        const id = params.id;
        const response = await fetch(`https://places.googleapis.com/v1/places/${id}?fields=id,displayName,location&key=${import.meta.env.VITE_MAPS_API_KEY}`);

        if (!response.ok) {
            return new Response('Error fetching place', { status: 500 });
        }

        const placeData = await response.json();
        return new Response(JSON.stringify(placeData));
    } catch (err) {
        return new Response('Error processing request', { status: 500 });
    }
}