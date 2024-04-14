import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.markets.upsert({
        where: { name: "bountiful" },
        update: {},
        create: {
            name: 'bountiful',
            displayName: "Bountiful Farmers' Market",
            address: '3696 97 Street NW, Edmonton AB',
            lat: 53.4721,
            lng: -113.481,
            type: 'permanent',
            link: 'https://bountifulmarkets.com/',
            open: 'All year',
            days: 'Friday: 10:00 am - 4:00 pm,Saturday: 9:00 am - 4:00 pm,Sunday: 10:00 am - 4:00 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "st-albert" },
        update: {},
        create: {
            name: 'st-albert',
            displayName: "St. Albert Outdoor Farmers' Market",
            address: 'St. Anne Street and St. Thomas Street, St. Albert AB',
            lat: 53.633,
            lng: -113.627,
            type: 'permanent',
            link: 'https://www.stalbertfarmersmarket.com/farmers-market',
            open: 'June - October',
            days: 'Saturday: 10:00 am - 3:00 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "south-common" },
        update: {},
        create: {
            name: 'south-common',
            displayName: "South Common Farmers' Market",
            address: '1311 102 St NW, Edmonton, AB',
            lat: 53.44188907732564,
            lng: -113.48740748790337,
            type: 'permanent',
            link: 'http://southcommonmarket.ca/',
            open: 'May - October',
            days: 'Saturday: 10:00 am - 4:00 pm,Sunday: 10:00 am - 4:00 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "strathcona" },
        update: {},
        create: {
            name: 'strathcona',
            displayName: "Old Strathcona Farmers' Market",
            address: '10310 83 Avenue NW, Edmonton AB',
            lat: 53.5199,
            lng: -113.496,
            type: 'permanent',
            link: 'http://osfm.ca/',
            open: 'All year',
            days: 'Saturday: 8:00 am - 3:00 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "callingwood" },
        update: {},
        create: {
            name: 'callingwood',
            displayName: "Callingwood Farmers' Market",
            address: '69 Avenue and 177 Street, Edmonton AB',
            lat: 53.5022,
            lng: -113.628,
            type: 'permanent',
            link: 'https://www.callingwoodmarketplace.com/farmers-market/',
            open: 'June - September (Wednesday),May - October (Sunday)',
            days: 'Wednesday: 12:00 pm - 4:00 pm,Sunday: 10:00 am - 3:00 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "southwest" },
        update: {},
        create: {
            name: 'southwest',
            displayName: "Southwest Edmonton Farmers' Market",
            address: '2051 Leger Road NW, Edmonton AB (Lot D, Terwilligar Community Rec Centre)',
            lat: 53.4586,
            lng: -113.582,
            type: 'permanent',
            link: 'http://swefm.ca/',
            open: 'May - October',
            days: 'Wednesday: 3:30 pm - 7:30 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "124-thursday" },
        update: {},
        create: {
            name: '124-thursday',
            displayName: "124 Grand Market (Thursday)",
            address: '12310 108 Ave NW, Edmonton AB',
            lat: 53.5527,
            lng: -113.535,
            type: 'permanent',
            link: 'http://124grandmarket.com/',
            open: 'May - October',
            days: 'Thursday: 4:00 pm - 8:00 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "124-sunday" },
        update: {},
        create: {
            name: '124-sunday',
            displayName: "124 Grand Market (Sunday)",
            address: '12328 102 Ave NW, Edmonton AB',
            lat: 53.5434,
            lng: -113.535,
            type: 'permanent',
            link: 'http://124grandmarket.com/',
            open: 'June - October',
            days: 'Sunday: 11:00 am - 3:00 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "salisbury" },
        update: {},
        create: {
            name: 'salisbury',
            displayName: "Salisbury Farmers' Market",
            address: '52337 Range Rd 232, Sherwood Park AB (Salisbury Greenhouse)',
            lat: 53.504,
            lng: -113.295,
            type: 'permanent',
            link: 'http://salisburyfarmersmarket.ca/',
            open: 'All year',
            days: 'Thursday: 4:00 pm - 7:00 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "beverly" },
        update: {},
        create: {
            name: 'beverly',
            displayName: "Beverly Towne Farmers' Market",
            address: 'Riverview Crossing Mall, 3210 118 Ave NW, Edmonton, AB',
            lat: 53.5715282,
            lng: -113.3905698,
            type: 'permanent',
            link: 'https://www.beverlyfarmersmarket.ca/',
            open: 'May - October',
            days: 'Tuesday: 3:00 pm - 7:00 pm'
        },
    })

    await prisma.markets.upsert({
        where: { name: "ottewell" },
        update: {},
        create: {
            name: 'ottewell',
            displayName: "Ottewell Artisan Farmers' Market",
            address: '5920 93A Ave NW, Edmonton, AB',
            lat: 53.5308891,
            lng: -113.4237746,
            type: 'permanent',
            link: 'http://www.ottewell.ca/ottewell-market/',
            open: 'All year',
            days: 'Thursday: 4:00 pm - 7:00 pm'
        },
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })