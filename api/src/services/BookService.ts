import { pool } from "../db"
import { v4 as uuidv4 } from "uuid"
import { Book } from "../models/Book";

class BookService {
    async findAll(): Promise<Book[]> {
        const result = await pool.query('SELECT id, title, author, publication_year AS "publicationYear" FROM books');
        return result.rows;
    }

    async findById(id: string): Promise<Book | undefined> {
        const result = await pool.query('SELECT id, title, author, publication_year AS "publicationYear" FROM books WHERE id = $1', [id]);
        return result.rows[0];
    }

    async create(data: Omit<Book, "id">): Promise<Book> {
        const id = uuidv4();
        await pool.query(
            'INSERT INTO books (id, title, author, publication_year) VALUES ($1, $2, $3, $4)', 
            [id, data.title, data.author, data.publicationYear]
        );
        return { id, ...data };
    }

    async update(id: string, data: Partial<Omit<Book, "id">>): Promise<Book | null> {
        const book = await this.findById(id);
        if (!book) return null;

        const updated = { ...book, ...data };
        await pool.query(
            'UPDATE books SET title = $1, author = $2, publication_year = $3 WHERE id = $4',
            [updated.title, updated.author, updated.publicationYear, id]
        );
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        const result = await pool.query('DELETE FROM books WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

export const bookService = new BookService()
