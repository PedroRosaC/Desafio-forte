import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { getBooks, createBook, deleteBook, Book } from "../../services/BookService";

export const BooksConfig = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publicationYear, setPublicationYear] = useState("");

    const load = async () => {
        const data = await getBooks();
        setBooks(data);
    };

    useEffect(() => {
        load();
    }, []);

    const handleCreate = async () => {
        await createBook({ title, author, publicationYear });
        setShowModal(false);
        load();
    };

    const handleDelete = async (id: string) => {
        await deleteBook(id);
        load();
    }

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between mb-2">
                <h4>Livros</h4>
                <Button onClick={() => setShowModal(true)}>Adicionar Livro</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Ano</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(b => (
                        <tr key={b.id}>
                            <td>{b.title}</td>
                            <td>{b.author}</td>
                            <td>{b.publicationYear}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(b.id)}>Excluir</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Livro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Autor</Form.Label>
                            <Form.Control value={author} onChange={e => setAuthor(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ano de Publicação</Form.Label>
                            <Form.Control value={publicationYear} onChange={e => setPublicationYear(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleCreate}>Salvar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};