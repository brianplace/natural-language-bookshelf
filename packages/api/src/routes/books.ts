import { Router, Response } from 'express';
import axios from 'axios';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { URLSearchParams } from 'node:url';

const router = Router();

interface SearchByParamsParams {
    title?: string;
    author?: string;
    subject?: string;
    isbn?: string;
}

router.get('/search-global', requireAuth, async (req: AuthRequest, res: Response) => {
    const params: SearchByParamsParams = req.body;
    const searchParams = new URLSearchParams({...params});

    try {
        const response = await axios.get('https://openlibrary.org/search.json', { params });

        const books = response.data.docs.map((doc: any) => ({
            openLibraryId: doc.key,
            title: doc.title,
            authors: doc.author_name || [],
            publishedDate: doc.first_publish_year?.toString(),
            isbn: doc.isbn?.[0],
            thumbnail: doc.cover_i
                ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                : null,
        }));

        res.json({ data: books});
    } catch (error) {
        res.status(500).json({error: 'Failed to search books'});
    }
});

router.get('/search', requireAuth, async (req: AuthRequest, res: Response) => {
    const { title, author, isbn } = req.body as SearchByParamsParams;

    if (!title && !author && !isbn) {
        res.status(400).json({ error: 'At least one search parameter (title, author, isbn) is required' });
        return;
    }

    try {
        let books;

        if (author) {
            // Split "Last, First", "First Last", or "Last" into individual terms
            const terms = author.split(/[\s,]+/).map((t: string) => t.trim()).filter(Boolean);
            const params: string[] = terms.map((t: string) => `%${t}%`);
            let paramIndex = 1;

            const authorConditions = terms.map(() => `a ILIKE $${paramIndex++}`).join(' AND ');
            const whereClauses = [`EXISTS (SELECT 1 FROM unnest(authors) AS a WHERE ${authorConditions})`];

            if (title) {
                params.push(`%${title}%`);
                whereClauses.push(`title ILIKE $${paramIndex++}`);
            }
            if (isbn) {
                params.push(`%${isbn}%`);
                whereClauses.push(`isbn ILIKE $${paramIndex++}`);
            }

            books = await prisma.$queryRawUnsafe(
                `SELECT * FROM "Book" WHERE ${whereClauses.join(' AND ')}`,
                ...params
            );
        } else {
            const where: { title?: object; isbn?: object } = {};
            if (title) where.title = { contains: title, mode: 'insensitive' };
            if (isbn) where.isbn = { contains: isbn, mode: 'insensitive' };
            books = await prisma.book.findMany({ where });
        }

        res.json({ data: books });
    } catch (error) {
        res.status(500).json({ error: 'Failed to search books' });
    }
});

router.post('/save', requireAuth, async (req: AuthRequest, res: Response) => {
    const { openLibraryId, title, authors, publishedDate, isbn, thumbnail } =
        req.body;

    if (!openLibraryId || !title) {
        res.status(400).json({ error: 'openLibraryId and title are required' });
        return;
    }

    try {
        const book = await prisma.book.upsert({
            where: { openLibraryId },
            update: {},
            create: {
                openLibraryId,
                title,
                authors,
                publishedDate,
                isbn,
                thumbnail,
            },
        });

        res.json({ data: book });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save book' });
    }
});

router.get('/collection', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const userBooks = await prisma.userBook.findMany({
            where: { userId: req.userId! },
            include: { book: true },
        });

        res.json({ data: userBooks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch collection' });
    }
});

router.post('/save-collection', requireAuth, async (req: AuthRequest, res: Response) => {
    const { bookId } = req.body;

    if (!bookId) {
        res.status(400).json({ error: 'bookId is required' });
        return;
    }

    try {
        const userBook = await prisma.userBook.upsert({
            where: { userId_bookId: { userId: req.userId!, bookId } },
            update: {},
            create: { userId: req.userId!, bookId },
        });

        res.json({ data: userBook });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save book to collection' });
    }
});

export default router;
