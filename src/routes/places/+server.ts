export const POST = async ({ request }) => {
    try {
        const payload = await request.json();
        const locationBias = {
            "circle": {
                "center": {
                    "latitude": 53.5461,
                    "longitude": -113.4938
                },
                "radius": 38000.0
            }
        }

        const placesResponse = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': import.meta.env.VITE_MAPS_API_KEY
            },
            body: JSON.stringify({
                "input": payload.input,
                locationBias,
            })
        });

        if (!placesResponse.ok) {
            return new Response('Error fetching places', { status: 500 });
        }

        const placesData = await placesResponse.json();
        const suggestions = placesData.suggestions.map((suggestion) => ({
            text: suggestion.placePrediction.text.text,
            placeId: suggestion.placePrediction.placeId,
        }));

        return new Response(JSON.stringify(suggestions));
    } catch (err) {
        return new Response('Error processing request', { status: 500 });
    }
}