import { error } from '@sveltejs/kit';
import { PrismaClient, type Sales } from '@prisma/client'
import dayjs from '$lib/dayjs';

const prisma = new PrismaClient();

const getDates = () => {
    const today = dayjs().toISOString();
    const weekAhead = dayjs(today).add(7, 'days').toISOString();

    return { today, weekAhead };
}

const setActive = (sale: any, today: string) => {
    const startTime = dayjs(sale.days[0].startTime);
    if (startTime.isSameOrBefore(today, 'day')) {
        sale.active = true;
    } else {
        sale.active = false;
    }
}

const setOwned = (sale: any, session: string) => {
    const saleSession = sale.session;
    delete sale.session;
    sale.owned = saleSession === session;
}

export const GET = async ({ cookies }) => {
    const session = cookies.get('session');
    const { today, weekAhead } = getDates();
    const response = await prisma.sales.findMany({
        where: {
            days: {
                some: {
                    endTime: { // TODO: Should this be startTime???
                        gte: today,
                        lt: weekAhead
                    }
                }
            }
        },
        include: {
            days: true
        },
    });

    for (const sale of response) {
        setActive(sale, today);
        setOwned(sale, session);
    }

    return new Response(JSON.stringify({
        sales: response
    }));
}

export const POST = async ({ request, cookies }) => {
    const sale = await request.json();
    const session = cookies.get('session');

    try {
        const created = await prisma.sales.create({
            data: {
                ...sale,
                session,
                days: {
                    create: sale.days
                }
            }
        });


        // Response does not contain "days", need to refetch to include all data
        const response = await prisma.sales.findUnique({
            where: {
                id: created.id
            },
            include: {
                days: true
            },
        });

        const { today } = getDates();
        setActive(response, today);
        setOwned(response, session);

        return new Response(JSON.stringify(response));
    } catch (err) {
        console.log(err)
        throw error(400);
    }
}