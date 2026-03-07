import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
    const { name, isTemplate } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const shelf = await prisma.shelf.create({
            data: {
                name,
                userId: req.userId!,
                isTemplate: isTemplate ?? false,
            },
        });

        res.status(201).json({ data: shelf });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create shelf' });
    }
});

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const shelves = await prisma.shelf.findMany({
            where: { userId: req.userId! },
            include: { books: { include: { book: true } } },
        });

        res.json({ data: shelves });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shelves' });
    }
});

router.patch('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const shelf = await prisma.shelf.findUnique({
            where: { id: String(id) },
        });

        if (!shelf || shelf.userId !== req.userId) {
            res.status(404).json({ error: 'Shelf not found' });
            return;
        }

        const updated = await prisma.shelf.update({
            where: { id: String(id) },
            data: { name },
        });

        res.json({ data: updated });
    } catch (error) {
        res.status(500).json({ error: 'Failed to rename shelf' });
    }
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const shelf = await prisma.shelf.findUnique({
            where: { id: String(id) },
        });

        if (!shelf || shelf.userId !== req.userId) {
            res.status(404).json({ error: 'Shelf not found' });
            return;
        }

        await prisma.shelfBook.deleteMany({ where: { shelfId: String(id) } });
        await prisma.shelf.delete({ where: { id: String(id) } });

        res.json({ data: { success: true } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete shelf' });
    }
});

// Add a book to a shelf
router.post(
    '/:id/books',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const { bookId } = req.body;

        if (!bookId) {
            res.status(400).json({ error: 'bookId is required' });
            return;
        }

        try {
            const shelf = await prisma.shelf.findUnique({
                where: { id: String(id) },
            });

            if (!shelf || shelf.userId !== req.userId) {
                res.status(404).json({ error: 'Shelf not found' });
                return;
            }

            const shelfBook = await prisma.shelfBook.create({
                data: { shelfId: String(id), bookId },
                include: { book: true },
            });
            res.status(201).json({ data: shelfBook });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add book to shelf' });
        }
    },
);

// Remove a book from a shelf
router.delete(
    '/:id/books/:bookId',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
        const { id, bookId } = req.params;

        try {
            const shelf = await prisma.shelf.findUnique({
                where: { id: String(id) },
            });

            if (!shelf || shelf.userId !== req.userId) {
                res.status(404).json({ error: 'Shelf not found' });
                return;
            }

            await prisma.shelfBook.delete({
                where: {
                    shelfId_bookId: {
                        shelfId: String(id),
                        bookId: String(bookId),
                    },
                },
            });
            res.json({ data: { success: true } });
        } catch (error) {
            res.status(500).json({ error: 'Failed to remove book from shelf' });
        }
    },
);

// Move a book between shelves
router.post(
    '/:id/books/:bookId/move',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
        const { id: fromShelfId, bookId } = req.params;
        const { toShelfId } = req.body;

        if (!toShelfId) {
            res.status(400).json({ error: 'toShelfId is required' });
            return;
        }

        try {
            const fromShelf = await prisma.shelf.findUnique({
                where: { id: String(fromShelfId) },
            });
            const toShelf = await prisma.shelf.findUnique({
                where: { id: toShelfId },
            });

            if (!fromShelf || fromShelf.userId !== req.userId) {
                res.status(404).json({ error: 'Source shelf not found' });
                return;
            }

            if (!toShelf || toShelf.userId !== req.userId) {
                res.status(404).json({ error: 'Destination shelf not found' });
                return;
            }

            await prisma.shelfBook.delete({
                where: {
                    shelfId_bookId: {
                        shelfId: String(fromShelfId),
                        bookId: String(bookId),
                    },
                },
            });

            const shelfBook = await prisma.shelfBook.create({
                data: { shelfId: toShelfId, bookId: String(bookId) },
                include: { book: true },
            });

            res.json({ data: shelfBook });
        } catch (error) {
            res.status(500).json({ error: 'Failed to move book' });
        }
    },
);

// Mark a book as lent out
router.patch(
    '/:id/books/:bookId/lend',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
        const { id, bookId } = req.params;
        const { lentTo } = req.body;

        if (!lentTo) {
            res.status(400).json({ error: 'lentTo is required' });
            return;
        }

        try {
            const shelf = await prisma.shelf.findUnique({
                where: { id: String(id) },
            });

            if (!shelf || shelf.userId !== req.userId) {
                res.status(404).json({ error: 'Shelf not found' });
                return;
            }

            const shelfBook = await prisma.shelfBook.update({
                where: {
                    shelfId_bookId: {
                        shelfId: String(id),
                        bookId: String(bookId),
                    },
                },
                data: { lentTo },
                include: { book: true },
            });

            res.json({ data: shelfBook });
        } catch (error) {
            res.status(500).json({ error: 'Failed to mark book as lent' });
        }
    },
);

// Mark a book as returned
router.patch(
    '/:id/books/:bookId/return',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
        const { id, bookId } = req.params;

        try {
            const shelf = await prisma.shelf.findUnique({
                where: { id: String(id) },
            });

            if (!shelf || shelf.userId !== req.userId) {
                res.status(404).json({ error: 'Shelf not found' });
                return;
            }

            const shelfBook = await prisma.shelfBook.update({
                where: {
                    shelfId_bookId: {
                        shelfId: String(id),
                        bookId: String(bookId),
                    },
                },
                data: { lentTo: null },
                include: { book: true },
            });

            res.json({ data: shelfBook });
        } catch (error) {
            res.status(500).json({ error: 'Failed to mark book as returned' });
        }
    },
);

export default router;
