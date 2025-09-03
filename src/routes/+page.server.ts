import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const load = async ({ fetch, cookies }) => {
    const session = cookies.get('session');
    if (!session) {
        const sessionId = uuidv4();
        /* @migration task: add path argument */ cookies.set('session', sessionId, { path: '/' });
    }

    const response = await fetch('/sales');
    if ( response.ok) {
        const res = await response.json();

        return {
            sales: res.sales,
            markets: res.markets
        };
    }
}