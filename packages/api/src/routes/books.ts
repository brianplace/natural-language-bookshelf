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
    isbn10?: string;
    isbn13?: string;
}

router.get('/search-global', requireAuth, async (req: AuthRequest, res: Response) => {
    const params: SearchByParamsParams = req.body;
    const searchParams = new URLSearchParams({...params});

    try {
        const response = await axios.get('https://openlibrary.org/search.json', { params });

        const books = response.data.docs.map((doc: any) => ({
            openLibraryId: doc.key,
            title: doc.title,
            fullTitle: doc.full_title ?? null,
            authors: doc.author_name || [],
            publishedDate: doc.first_publish_year?.toString(),
            isbn10: doc.isbn?.[0] ?? null,
            isbn13: doc.isbn_13?.[0] ?? null,
            thumbnail: doc.cover_i
                ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                : null,
        }));

        const booksWithEditions = await Promise.all(
            books.map(async (book: any) => {
                try {
                    const editionsResponse = await axios.get(
                        `https://openlibrary.org${book.openLibraryId}/editions.json`
                    );
                    const totalEditions: number = editionsResponse.data.size ?? editionsResponse.data.entries?.length ?? 0;
                    const entries = editionsResponse.data.entries ?? [];
                    const editions = entries.slice(0, 10).map((entry: any) => ({
                        key: entry.key,
                        title: entry.title,
                        fullTitle: entry.full_title,
                        publishers: entry.publishers,
                        publishDate: entry.publish_date,
                        physicalFormat: entry.physical_format,
                        numberOfPages: entry.number_of_pages,
                        isbn10: entry.isbn_10,
                        isbn13: entry.isbn_13,
                        languages: entry.languages,
                        covers: entry.covers,
                        authors: entry.authors,
                        works: entry.works,
                        description: entry.description,
                        notes: entry.notes,
                        sourceRecords: entry.source_records,
                        identifiers: entry.identifiers,
                        type: entry.type,
                        revision: entry.revision,
                        latestRevision: entry.latest_revision,
                        created: entry.created,
                        lastModified: entry.last_modified,
                    }));
                    return { ...book, editions, hasMoreEditions: totalEditions > 10 };
                } catch {
                    return { ...book, editions: [], hasMoreEditions: false };
                }
            })
        );

        res.json({ data: booksWithEditions });
    } catch (error) {
        res.status(500).json({error: 'Failed to search books'});
    }
});

router.get('/search', requireAuth, async (req: AuthRequest, res: Response) => {
    const { title, author, isbn10, isbn13 } = req.body as SearchByParamsParams;
    const isbn = isbn10 || isbn13;

    if (!title && !author && !isbn) {
        res.status(400).json({ error: 'At least one search parameter (title, author, isbn10, isbn13) is required' });
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
                params.push(`%${title}%`, `%${title}%`);
                whereClauses.push(`(title ILIKE $${paramIndex++} OR "fullTitle" ILIKE $${paramIndex++})`);
            }
            if (isbn10) {
                params.push(`%${isbn10}%`);
                whereClauses.push(`isbn10 ILIKE $${paramIndex++}`);
            }
            if (isbn13) {
                params.push(`%${isbn13}%`);
                whereClauses.push(`isbn13 ILIKE $${paramIndex++}`);
            }

            books = await prisma.$queryRawUnsafe(
                `SELECT * FROM "Book" WHERE ${whereClauses.join(' AND ')}`,
                ...params
            );
        } else {
            const where: { OR?: object[]; isbn10?: object; isbn13?: object } = {};
            if (title) where.OR = [
                { title: { contains: title, mode: 'insensitive' } },
                { fullTitle: { contains: title, mode: 'insensitive' } },
            ];
            if (isbn10) where.isbn10 = { contains: isbn10, mode: 'insensitive' };
            if (isbn13) where.isbn13 = { contains: isbn13, mode: 'insensitive' };
            books = await prisma.book.findMany({ where });
        }

        res.json({ data: books });
    } catch (error) {
        res.status(500).json({ error: 'Failed to search books' });
    }
});

router.post('/save', requireAuth, async (req: AuthRequest, res: Response) => {
    const { openLibraryId, title, fullTitle, authors, description, publishedDate, isbn10, isbn13, thumbnail, format, type, revision } =
        req.body;

    if (!openLibraryId || !title) {
        res.status(400).json({ error: 'openLibraryId and title are required' });
        return;
    }

    try {
        const fields = { title, fullTitle, authors, description, publishedDate, isbn10, isbn13, thumbnail, format, type, revision };
        const book = await prisma.book.upsert({
            where: { openLibraryId },
            update: fields,
            create: { openLibraryId, ...fields },
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
    const { openLibraryId, title, fullTitle, authors, description, publishedDate, isbn10, isbn13, thumbnail, format, type, revision } = req.body;

    if (!openLibraryId || !title) {
        res.status(400).json({ error: 'openLibraryId and title are required' });
        return;
    }

    try {
        const fields = { title, fullTitle, authors, description, publishedDate, isbn10, isbn13, thumbnail, format, type, revision };
        const book = await prisma.book.upsert({
            where: { openLibraryId },
            update: fields,
            create: { openLibraryId, ...fields },
        });

        const userBook = await prisma.userBook.upsert({
            where: { userId_bookId: { userId: req.userId!, bookId: book.id } },
            update: {},
            create: { userId: req.userId!, bookId: book.id },
        });

        res.json({ data: userBook });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save book to collection' });
    }
});

router.get('/get-editions', requireAuth, async (req: AuthRequest, res: Response) => {
    const { openLibraryId } = req.query as { openLibraryId?: string };

    if (!openLibraryId) {
        res.status(400).json({ error: 'openLibraryId is required' });
        return;
    }

    try {
        const response = await axios.get(`https://openlibrary.org${openLibraryId}/editions.json`);

        const editions = response.data.entries.map((entry: any) => ({
            key: entry.key,
            title: entry.title,
            fullTitle: entry.full_title,
            publishers: entry.publishers,
            publishDate: entry.publish_date,
            physicalFormat: entry.physical_format,
            numberOfPages: entry.number_of_pages,
            isbn10: entry.isbn_10,
            isbn13: entry.isbn_13,
            languages: entry.languages,
            covers: entry.covers,
            authors: entry.authors,
            works: entry.works,
            description: entry.description,
            notes: entry.notes,
            sourceRecords: entry.source_records,
            identifiers: entry.identifiers,
            type: entry.type,
            revision: entry.revision,
            latestRevision: entry.latest_revision,
            created: entry.created,
            lastModified: entry.last_modified,
        }));

        res.json({ data: editions });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch editions' });
    }
});

router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const id = req.params['id'] as string;

    try {
        const book = await prisma.book.findUnique({ where: { id } });

        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        res.json({ data: book });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

export default router;
