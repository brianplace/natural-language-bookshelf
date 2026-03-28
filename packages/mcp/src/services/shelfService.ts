import prisma from '../lib/prisma';

async function requireOwnedShelf(shelfId: string, userId: string) {
    const shelf = await prisma.shelf.findUnique({ where: { id: shelfId } });
    if (!shelf || shelf.userId !== userId) {
        throw new Error('Shelf not found');
    }
    return shelf;
}

export async function createShelf(userId: string, name: string, isTemplate?: boolean) {
    if (!name) throw new Error('Name is required');
    return prisma.shelf.create({
        data: { name, userId, isTemplate: isTemplate ?? false },
    });
}

export async function listShelves(userId: string) {
    return prisma.shelf.findMany({
        where: { userId },
        include: { books: { include: { book: true } } },
    });
}

export async function renameShelf(userId: string, shelfId: string, name: string) {
    if (!name) throw new Error('Name is required');
    await requireOwnedShelf(shelfId, userId);
    return prisma.shelf.update({ where: { id: shelfId }, data: { name } });
}

export async function deleteShelf(userId: string, shelfId: string) {
    await requireOwnedShelf(shelfId, userId);
    await prisma.shelfBook.deleteMany({ where: { shelfId } });
    await prisma.shelf.delete({ where: { id: shelfId } });
}

export async function addBookToShelf(userId: string, shelfId: string, bookId: string) {
    if (!bookId) throw new Error('bookId is required');
    await requireOwnedShelf(shelfId, userId);
    return prisma.shelfBook.create({
        data: { shelfId, bookId },
        include: { book: true },
    });
}

export async function removeBookFromShelf(userId: string, shelfId: string, bookId: string) {
    await requireOwnedShelf(shelfId, userId);
    await prisma.shelfBook.delete({
        where: { shelfId_bookId: { shelfId, bookId } },
    });
}

export async function moveBook(userId: string, fromShelfId: string, bookId: string, toShelfId: string) {
    if (!toShelfId) throw new Error('toShelfId is required');

    const fromShelf = await prisma.shelf.findUnique({ where: { id: fromShelfId } });
    if (!fromShelf || fromShelf.userId !== userId) {
        throw new Error('Source shelf not found');
    }

    const toShelf = await prisma.shelf.findUnique({ where: { id: toShelfId } });
    if (!toShelf || toShelf.userId !== userId) {
        throw new Error('Destination shelf not found');
    }

    await prisma.shelfBook.delete({
        where: { shelfId_bookId: { shelfId: fromShelfId, bookId } },
    });

    return prisma.shelfBook.create({
        data: { shelfId: toShelfId, bookId },
        include: { book: true },
    });
}

export async function markAsLent(userId: string, shelfId: string, bookId: string, lentTo: string) {
    if (!lentTo) throw new Error('lentTo is required');
    await requireOwnedShelf(shelfId, userId);
    return prisma.shelfBook.update({
        where: { shelfId_bookId: { shelfId, bookId } },
        data: { lentTo },
        include: { book: true },
    });
}

export async function markAsReturned(userId: string, shelfId: string, bookId: string) {
    await requireOwnedShelf(shelfId, userId);
    return prisma.shelfBook.update({
        where: { shelfId_bookId: { shelfId, bookId } },
        data: { lentTo: null },
        include: { book: true },
    });
}
