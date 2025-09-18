import { writable, get, derived } from "svelte/store";
import dayjs from '$lib/dayjs';
import { hasIntersection } from "./utils";

export const Sales = writable<Sale[]>([]);

const createSale = () => {
    const days: Day[] = [];
    const { subscribe, set, update } = writable({
        address: '',
        lat: 0,
        lng: 0,
        type: 'yard',
        tags: [],
        days
    });

    const createDay = (prevDay: Day|null = null): Day => {
        let newDate = prevDay
            ? dayjs(prevDay?.date).add(1, 'day')
            : dayjs()
        return {
            date: newDate.format('YYYY-MM-DD'),
            startTime: '12:00',
            endTime: '18:00',
            errors: [false, false, false]
        };
    }

    const addDay = () => {
        update(s => {
            const prevDay = s.days[s.days.length - 1];
            const newDay = createDay(prevDay);
            return {
                ...s,
                days: [...s.days, newDay]
            }
        });
    }

    const removeDay = (index: number) => {
        update(s => {
            s.days.splice(index, 1);
            return {
                ...s,
                days: s.days
            }
        });
    }

    const setAddress = ({ address, lat, lng }: { address: string|undefined, lat: number|undefined, lng: number|undefined }) => {
        if (!address || !lat || !lng) {
            return
        }
        update(s => {
            return {
                ...s,
                address,
                lat,
                lng
            }
        })
    }

    const reset = () => {
        const firstDay = createDay();
        set({
            address: '',
            lat: 0,
            lng: 0,
            type: 'yard',
            tags: [],
            days: [firstDay]
        });
    }

    return {
        subscribe,
        set,
        reset,
        addDay,
        removeDay,
        setAddress
    }
}

export const sale = createSale();

const createFilters = () => {
    const { subscribe, set, update } = writable({
        onlyActive: false,
        type: null,
        tags: []
    })

    const reset = () => {
        set({
            onlyActive: false,
            type: null,
            tags: []
        })
    }

    return {
        subscribe,
        set,
        reset
    }
}

export const Filters = createFilters();

export const DisplayedSales = derived(
    [Sales, Filters],
    ([$Sales, $Filters]) => {
        return $Sales.filter(sale => {
            // Active
            if ($Filters.onlyActive && !sale.active) {
                return false;
            }

            // Type
            if ($Filters.type) {
                if ($Filters.type === 'market' && (sale.type === 'market' || sale.type === 'permanent')) {
                    // Do nothing
                } else if (sale.type !== $Filters.type) {
                    return false;
                }
            }

            // Tags
            if ($Filters.tags.length) {
                if (!sale.tags) {
                    return false;
                }

                const saleTags = sale.tags.split(',');
                if (!hasIntersection(saleTags, $Filters.tags)) {
                    return false;
                }
            }

            return true;
        })
    }
);