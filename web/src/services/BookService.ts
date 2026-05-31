import { Api } from "./Api";

export interface Book {
    id: string;
    title: string;
    author: string;
    publicationYear: string;
}

export async function getBooks(): Promise<Book[]> {
    const { data } = await Api.get("/books");
    return data;
}

export async function createBook(book: Omit<Book, "id">): Promise<Book> {
    const { data } = await Api.post("/books", book);
    return data;
}

export async function updateBook(id: string, book: Omit<Book, "id">): Promise<Book> {
    const { data } = await Api.put(`/books/${id}`, book);
    return data;
}

export async function deleteBook(id: string): Promise<void> {
    await Api.delete(`/books/${id}`);
}
