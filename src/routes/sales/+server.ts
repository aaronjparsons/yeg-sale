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
    if (startTime.isSameOrBefore(today)) {
        sale.active = true;
    } else {
        sale.active = false;
    }
}

export const GET = async () => {
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
    }

    return new Response(JSON.stringify({
        sales: response
    }));
}

export const POST = async ({ request }) => {
    const sale = await request.json();

    try {
        await prisma.sales.create({
            data: {
                ...sale,
                days: {
                    create: sale.days
                }
            }
        });
        const { today } = getDates();
        setActive(sale, today);

        return new Response(JSON.stringify(sale));
    } catch (err) {
        throw error(400);
    }
}