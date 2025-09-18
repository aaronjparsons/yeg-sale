import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const POST = async ({ request }) => {
    const data = await request.json();

    try {
        const created = await prisma.marketReports.create({
            data
        });

        return new Response(JSON.stringify({}), { status: 201 });
    } catch (err) {
        console.log(err)
        error(err?.status || 400);
    }
}