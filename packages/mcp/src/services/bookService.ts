import axios from 'axios';
import prisma from '../lib/prisma';

interface SearchByParamsParams {
    title?: string;
    author?: string;
    isbn10?: string;
    isbn13?: string;
}

interface BookFields {
    openLibraryId: string;
    title: string;
    fullTitle?: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    isbn10?: string;
    isbn13?: string;
    thumbnail?: string;
    format?: string;
    type?: string;
    revision?: number;
}

export async function searchBooks(params: SearchByParamsParams) {
    const { title, author, isbn10, isbn13 } = params;
    const isbn = isbn10 || isbn13;

    if (!title && !author && !isbn) {
        throw new Error('At least one search parameter (title, author, isbn10, isbn13) is required');
    }

    if (author) {
        const terms = author.split(/[\s,]+/).map((t: string) => t.trim()).filter(Boolean);
        const queryParams: string[] = terms.map((t: string) => `%${t}%`);
        let paramIndex = 1;

        const authorConditions = terms.map(() => `a ILIKE $${paramIndex++}`).join(' AND ');
        const whereClauses = [`EXISTS (SELECT 1 FROM unnest(authors) AS a WHERE ${authorConditions})`];

        if (title) {
            queryParams.push(`%${title}%`, `%${title}%`);
            whereClauses.push(`(title ILIKE $${paramIndex++} OR "fullTitle" ILIKE $${paramIndex++})`);
        }
        if (isbn10) {
            queryParams.push(`%${isbn10}%`);
            whereClauses.push(`isbn10 ILIKE $${paramIndex++}`);
        }
        if (isbn13) {
            queryParams.push(`%${isbn13}%`);
            whereClauses.push(`isbn13 ILIKE $${paramIndex++}`);
        }

        return prisma.$queryRawUnsafe(
            `SELECT * FROM "Book" WHERE ${whereClauses.join(' AND ')}`,
            ...queryParams
        );
    } else {
        const where: { OR?: object[]; isbn10?: object; isbn13?: object } = {};
        if (title) where.OR = [
            { title: { contains: title, mode: 'insensitive' } },
            { fullTitle: { contains: title, mode: 'insensitive' } },
        ];
        if (isbn10) where.isbn10 = { contains: isbn10, mode: 'insensitive' };
        if (isbn13) where.isbn13 = { contains: isbn13, mode: 'insensitive' };
        return prisma.book.findMany({ where });
    }
}

export async function searchBooksGlobal(params: SearchByParamsParams) {
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

    return Promise.all(
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
}

export async function saveBook(fields: BookFields) {
    const { openLibraryId, title, ...rest } = fields;
    return prisma.book.upsert({
        where: { openLibraryId },
        update: { title, ...rest },
        create: { openLibraryId, title, ...rest },
    });
}

export async function getCollection(userId: string) {
    return prisma.userBook.findMany({
        where: { userId },
        include: { book: true },
    });
}

export async function saveToCollection(userId: string, fields: BookFields) {
    const { openLibraryId, title, ...rest } = fields;
    const book = await prisma.book.upsert({
        where: { openLibraryId },
        update: { title, ...rest },
        create: { openLibraryId, title, ...rest },
    });

    return prisma.userBook.upsert({
        where: { userId_bookId: { userId, bookId: book.id } },
        update: {},
        create: { userId, bookId: book.id },
    });
}

export async function getEditions(openLibraryId: string) {
    const response = await axios.get(`https://openlibrary.org${openLibraryId}/editions.json`);
    return response.data.entries.map((entry: any) => ({
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
}

export async function getBook(id: string) {
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
        throw new Error('Book not found');
    }
    return book;
}
