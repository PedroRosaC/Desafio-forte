import { Request, Response } from "express"
import { bookService } from "../services/BookService"

export const getAllBooks = async (req: Request, res: Response) => {
    const books = await bookService.findAll()
    res.json(books)
}

export const getBookById = async (req: Request, res: Response) => {
    const { id } = req.params
    const book = await bookService.findById(id)
    if (!book) return res.status(404).json({ message: "Book not found" })
    res.json(book)
}

export const createBook = async (req: Request, res: Response) => {
    const { title, author, publicationYear } = req.body
    if (!title || !author || !publicationYear) {
        return res.status(400).json({ message: "Missing fields" })
    }
    const book = await bookService.create({ title, author, publicationYear })
    res.status(201).json(book)
}

export const updateBook = async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, author, publicationYear } = req.body
    const updated = await bookService.update(id, { title, author, publicationYear })
    if (!updated) return res.status(404).json({ message: "Book not found" })
    res.json(updated)
}

export const deleteBook = async (req: Request, res: Response) => {
    const { id } = req.params
    const ok = await bookService.delete(id)
    if (!ok) return res.status(404).json({ message: "Book not found" })
    res.status(204).send()
}
