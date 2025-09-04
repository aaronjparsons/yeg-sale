export const SALE_TYPES = {
    yard: 'Yard Sale',
    estate: 'Estate Sale',
    market: 'Market',
    craft: 'Craft Fair'
}

export const TAGS = [
    'Antiques', 'Baby items', 'Books/Media', 'Clothing', 'Collectibles', 'Crafts', 'Electronics', 'Food',
    'Furniture', 'Games', 'Housewares', 'Sporting goods', 'Toys', 'Tools',
];

export const MARKERS = {
    active: {
        path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "limegreen",
        fillOpacity: 1,
        strokeWeight: 2,
        rotation: 0,
        scale: 1.35,
        color: 'fill-green',
        letter: null,
    },
    upcoming: {
        path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "yellow",
        fillOpacity: 1,
        strokeWeight: 2,
        rotation: 0,
        scale: 1.35,
        color: 'fill-yellow',
        letter: null,
    },
    permanent: {
        path: "m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z",
        fillColor: "rebeccapurple",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: 'white',
        rotation: 0,
        scale: 1.35,
        color: 'fill-purple',
        letter: 'M',
    }
}

export const hasIntersection = (array1, array2) => {
    for (const val of array1) {
        if (array2.includes(val)) {
            return true;
        }
    }
    return false;
};