import { error } from '@sveltejs/kit';
import { PrismaClient, type Sales } from '@prisma/client'

const prisma = new PrismaClient();

export const DELETE = async ({ params, cookies }) => {
    try {
        const session = cookies.get('session');
        const response = await prisma.sales.findUnique({
            where: {
                id: parseInt(params.id)
            }
        });

        if (response?.session !== session) {
            throw error(401);
        }

        await prisma.sales.delete({
            where: {
                id: parseInt(params.id)
            }
        });
        return new Response();
    } catch (err) {
        console.log(err)
        throw error(err?.status || 400);
    }
}