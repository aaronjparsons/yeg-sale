import { writable, get } from "svelte/store";
import dayjs from '$lib/dayjs';

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
        return { date: newDate.toDate(), startTime: '14:00', endTime: '20:00' };
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
                day: s.days
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

export const filters = writable({
    type: null,
    tags: []
})