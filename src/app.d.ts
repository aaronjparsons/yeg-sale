// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
}

interface Sale {
    id?: number,
    address: string,
    lat: number,
    lng: number,
    type: string,
    tags: string[] | string,
    days: Day[]
    active?: boolean
    infowindow?: google.maps.InfoWindow
    session?: string,
    owned?: boolean
    displayName?: string
}

interface Day {
    date?: string,
    startTime: string,
    endTime: string,
    errors?: boolean[]
}

interface Market {
    id?: number,
    address: string,
    name: string,
    displayName: string,
    lat: number,
    lng: number,
    type: string,
    open: string,
    days: string,
    link: string,
    infowindow?: google.maps.InfoWindow
}


