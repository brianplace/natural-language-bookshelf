import prisma from '../lib/prisma';

export async function listLentBooks(userId: string) {
    return prisma.shelfBook.findMany({
        where: {
            shelf: { userId },
            lentTo: { not: null },
        },
        include: {
            book: true,
            shelf: true,
        },
    });
}
