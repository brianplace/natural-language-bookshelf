export interface Book {
    id: string;
    googleBooksId: string;
    title: string;
    authors: string[];
    description?: string;
    thumbnail?: string;
    isbn?: string;
    publishedDate?: string;
}

// Shelf types
export interface Shelf {
    id: string;
    name: string;
    userId: string;
    isTemplate: boolean;
    createdAt: Date;
}

export interface ShelfBook {
    shelfId: string;
    bookId: string;
    addedAt: Date;
    lentTo?: string;
}

// API response wrapper
export interface ApiResponse<T> {
    data?: T;
    error?: string;
}
