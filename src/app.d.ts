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

}

interface Day {
    date?: string,
    startTime: string,
    endTime: string
}

