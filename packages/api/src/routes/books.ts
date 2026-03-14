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

router.get('/search', requireAuth, async (req: AuthRequest, res: Response) => {
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

// router.get('/search', requireAuth, async (req: AuthRequest, res: Response) => {
//     const { q } = req.query;

//     if (!q || typeof q !== 'string') {
//         res.status(400).json({ error: 'Query parameter "q" is required' });
//         return;
//     }

//     try {
//         const response = await axios.get(
//             'https://openlibrary.org/search.json',
//             {
//                 params: { q, limit: 10 },
//             },
//         );

//         const books = response.data.docs.map((doc: any) => ({
//             openLibraryId: doc.key,
//             title: doc.title,
//             authors: doc.author_name || [],
//             publishedDate: doc.first_publish_year?.toString(),
//             isbn: doc.isbn?.[0],
//             thumbnail: doc.cover_i
//                 ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
//                 : null,
//         }));

//         res.json({ data: books });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to search books' });
//     }
// });

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

export default router;
