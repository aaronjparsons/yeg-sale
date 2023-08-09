export const load = async ({ fetch }) => {
    const response = await fetch('/sales');

    if ( response.ok) {
        const res = await response.json();

        return {
            sales: res.sales
        };
    }
}