import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { getLoans, createLoan, deleteLoan, updateLoanStatus, updateLoan, Loan } from "../../services/LoanService";
import { getBooks, Book } from "../../services/BookService";

export const LoansConfig = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [bookId, setBookId] = useState("");
    const [userName, setUserName] = useState("");
    const [loanDate, setLoanDate] = useState("");

    const load = async () => {
        const [l, b] = await Promise.all([getLoans(), getBooks()]);
        setLoans(l);
        setBooks(b);
        if (b.length > 0 && !bookId) setBookId(b[0].id);
    };

    useEffect(() => {
        load();
    }, []);

    const handleSave = async () => {
        if (editingId) {
            await updateLoan(editingId, { bookId, userName, loanDate });
        } else {
            await createLoan({ bookId, userName, loanDate });
        }
        setShowModal(false);
        setEditingId(null);
        setBookId(books.length > 0 ? books[0].id : "");
        setUserName("");
        setLoanDate("");
        load();
    };

    const handleEdit = (l: Loan) => {
        setBookId(l.bookId);
        setUserName(l.userName);
        setLoanDate(l.loanDate.split('T')[0]);
        setEditingId(l.id);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        await deleteLoan(id);
        load();
    };

    const handleStatus = async (id: string, status: "devolvido" | "extraviado") => {
        await updateLoanStatus(id, status);
        load();
    };

    const formatBRL = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between mb-2">
                <h4>Empréstimos</h4>
                <Button onClick={() => {
                    setEditingId(null);
                    setBookId(books.length > 0 ? books[0].id : "");
                    setUserName("");
                    setLoanDate("");
                    setShowModal(true);
                }}>Adicionar Empréstimo</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Livro</th>
                        <th>Usuário</th>
                        <th>Data Emp.</th>
                        <th>Data Esp. Dev.</th>
                        <th>Data Real Dev.</th>
                        <th>Status</th>
                        <th>Multa</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map(l => {
                        const book = books.find(b => b.id === l.bookId);
                        return (
                            <tr key={l.id}>
                                <td>{book?.title || l.bookId}</td>
                                <td>{l.userName}</td>
                                <td>{new Date(l.loanDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
                                <td>{new Date(l.expectedReturnDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
                                <td>{l.returnDate ? new Date(l.returnDate).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "-"}</td>
                                <td>{l.status}</td>
                                <td>{formatBRL(l.fine || 0)}</td>
                                <td>
                                    {l.status === 'emprestado' && (
                                        <>
                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleStatus(l.id, "devolvido")}>Devolver</Button>
                                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleStatus(l.id, "extraviado")}>Extraviar</Button>
                                        </>
                                    )}
                                    <Button variant="primary" size="sm" className="me-2" onClick={() => handleEdit(l)}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(l.id)}>Excluir</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? "Editar Empréstimo" : "Adicionar Empréstimo"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Livro</Form.Label>
                            <Form.Select value={bookId} onChange={e => setBookId(e.target.value)}>
                                {books.map(b => (
                                    <option key={b.id} value={b.id}>{b.title}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuário</Form.Label>
                            <Form.Control value={userName} onChange={e => setUserName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Data de Empréstimo</Form.Label>
                            <Form.Control type="date" value={loanDate} onChange={e => setLoanDate(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSave}>Salvar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};