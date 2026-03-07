import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// List all lent books across all shelves
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const lentBooks = await prisma.shelfBook.findMany({
            where: {
                shelf: { userId: req.userId! },
                lentTo: { not: null },
            },
            include: {
                book: true,
                shelf: true,
            },
        });
        res.json({ data: lentBooks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lent books' });
    }
});

export default router;
