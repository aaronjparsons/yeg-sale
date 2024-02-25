export const SALE_TYPES = {
    yard: 'Yard Sale',
    estate: 'Estate Sale',
    market: 'Market'
}

export const TAGS = [
    'Antiques', 'Baby Items', 'Books/Media', 'Clothing', 'Collectibles',  'Electronics', 'Food',
    'Furniture', 'Housewares', 'Sporting Goods', 'Toys', 'Tools',
];

export const hasIntersection = (array1, array2) => {
    for (const val of array1) {
        if (array2.includes(val)) {
            return true;
        }
    }
    return false;
};