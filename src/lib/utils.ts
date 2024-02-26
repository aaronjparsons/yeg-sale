export const SALE_TYPES = {
    yard: 'Yard Sale',
    estate: 'Estate Sale',
    market: 'Market'
}

export const TAGS = [
    'Antiques', 'Baby Items', 'Books/Media', 'Clothing', 'Collectibles',  'Electronics', 'Food',
    'Furniture', 'Housewares', 'Sporting Goods', 'Toys', 'Tools',
];

export const MARKERS = {
    active: {
        path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "limegreen",
        fillOpacity: 1,
        strokeWeight: 2,
        rotation: 0,
        scale: 1.5,
    },
    upcoming: {
        path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "yellow",
        fillOpacity: 1,
        strokeWeight: 2,
        rotation: 0,
        scale: 1.5,
    },
    permanent: {
        path: 'M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 0 0 9.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 0 0 2.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3Zm3-6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm8.25-.75a.75.75 0 0 0-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-5.25a.75.75 0 0 0-.75-.75h-3ZM5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 7.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 0 0 4.902-5.652l-1.3-1.299a1.875 1.875 0 0 0-1.325-.549H5.223Z',
        fillColor: "purple",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: 'grey',
        rotation: 0,
        scale: 1.25,
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