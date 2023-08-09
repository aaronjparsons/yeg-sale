import { writable, get } from "svelte/store";
import dayjs from '$lib/dayjs';

const createSale = () => {
    const days: Day[] = [];
    const { subscribe, set, update } = writable({
        address: '',
        lat: 0,
        lng: 0,
        type: 'yard',
        days
    });

    const createDay = (prevDay: Day|null = null): Day => {
        let newDate = prevDay
            ? dayjs(prevDay?.date).add(1, 'day').format('YYYY-MM-DD')
            : dayjs().format('YYYY-MM-DD')
        return { date: newDate, startTime: '14:00', endTime: '20:00' };
    }

    const addDay = () => {
        update(s => {
            const prevDay = s.days[days.length - 1];
            const newDay = createDay(prevDay);
            return {
                ...s,
                days: [...s.days, newDay]
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
            days: [firstDay]
        });
    }

    return {
        subscribe,
        set,
        reset,
        addDay,
        setAddress
    }
}

export const sale = createSale();