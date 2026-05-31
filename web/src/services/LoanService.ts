import { Api } from "./Api";

export interface Loan {
    id: string;
    bookId: string;
    userName: string;
    loanDate: string;
    expectedReturnDate: string;
    returnDate: string | null;
    status: "emprestado" | "devolvido" | "devolvido com atraso" | "extraviado";
    fine?: number;
}

export async function getLoans(): Promise<Loan[]> {
    const { data } = await Api.get("/loans");
    return data;
}

export async function createLoan(loan: { bookId: string; userName: string; loanDate: string }): Promise<Loan> {
    const { data } = await Api.post("/loans", loan);
    return data;
}

export async function updateLoanStatus(id: string, status: "devolvido" | "extraviado"): Promise<Loan> {
    const { data } = await Api.patch(`/loans/${id}/status`, { status });
    return data;
}

export async function deleteLoan(id: string): Promise<void> {
    await Api.delete(`/loans/${id}`);
}
