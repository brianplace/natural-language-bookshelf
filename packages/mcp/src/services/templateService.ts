import prisma from '../lib/prisma';

async function requireOwnedShelf(shelfId: string, userId: string) {
    const shelf = await prisma.shelf.findUnique({ where: { id: shelfId } });
    if (!shelf || shelf.userId !== userId) {
        throw new Error('Shelf not found');
    }
    return shelf;
}

export async function publishTemplate(userId: string, shelfId: string) {
    await requireOwnedShelf(shelfId, userId);
    return prisma.shelf.update({ where: { id: shelfId }, data: { isTemplate: true } });
}

export async function unpublishTemplate(userId: string, shelfId: string) {
    await requireOwnedShelf(shelfId, userId);
    return prisma.shelf.update({ where: { id: shelfId }, data: { isTemplate: false } });
}

export async function searchTemplates(q?: string) {
    return prisma.shelf.findMany({
        where: {
            isTemplate: true,
            ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
        },
        include: {
            books: { include: { book: true } },
            user: { select: { email: true } },
        },
    });
}

export async function cloneTemplate(userId: string, shelfId: string) {
    const template = await prisma.shelf.findUnique({
        where: { id: shelfId },
        include: { books: true },
    });

    if (!template || !template.isTemplate) {
        throw new Error('Template not found');
    }

    return prisma.shelf.create({
        data: {
            name: template.name,
            userId,
            isTemplate: false,
            books: {
                create: template.books.map((b) => ({ bookId: b.bookId })),
            },
        },
        include: { books: { include: { book: true } } },
    });
}
