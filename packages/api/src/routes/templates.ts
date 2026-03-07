import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Publish a shelf as a template
router.post(
    '/:shelfId/publish',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
        const { shelfId } = req.params;

        try {
            const shelf = await prisma.shelf.findUnique({
                where: { id: String(shelfId) },
            });

            if (!shelf || shelf.userId !== req.userId) {
                res.status(404).json({ error: 'Shelf not found' });
                return;
            }

            const updated = await prisma.shelf.update({
                where: { id: String(shelfId) },
                data: { isTemplate: true },
            });

            res.json({ data: updated });
        } catch (error) {
            res.status(500).json({ error: 'Failed to publish template' });
        }
    },
);

// Unpublish a template
router.post(
    '/:shelfId/unpublish',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
        const { shelfId } = req.params;

        try {
            const shelf = await prisma.shelf.findUnique({
                where: { id: String(shelfId) },
            });

            if (!shelf || shelf.userId !== req.userId) {
                res.status(404).json({ error: 'Shelf not found' });
                return;
            }

            const updated = await prisma.shelf.update({
                where: { id: String(shelfId) },
                data: { isTemplate: false },
            });

            res.json({ data: updated });
        } catch (error) {
            res.status(500).json({ error: 'Failed to unpublish template' });
        }
    },
);

// Browse all templates
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
    const { q } = req.query;

    try {
        const templates = await prisma.shelf.findMany({
            where: {
                isTemplate: true,
                ...(q && typeof q === 'string'
                    ? { name: { contains: q, mode: 'insensitive' } }
                    : {}),
            },
            include: {
                books: { include: { book: true } },
                user: { select: { email: true } },
            },
        });

        res.json({ data: templates });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// Clone a template
router.post(
    '/:shelfId/clone',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
        const { shelfId } = req.params;

        try {
            const template = await prisma.shelf.findUnique({
                where: { id: String(shelfId) },
                include: { books: true },
            });

            if (!template || !template.isTemplate) {
                res.status(404).json({ error: 'Template not found' });
                return;
            }

            const newShelf = await prisma.shelf.create({
                data: {
                    name: template.name,
                    userId: req.userId!,
                    isTemplate: false,
                    books: {
                        create: template.books.map((b) => ({
                            bookId: b.bookId,
                        })),
                    },
                },
                include: { books: { include: { book: true } } },
            });

            res.status(201).json({ data: newShelf });
        } catch (error) {
            res.status(500).json({ error: 'Failed to clone template' });
        }
    },
);

export default router;
