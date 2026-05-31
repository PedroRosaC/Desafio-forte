export interface Loan {
    id: string;
    bookId: string;
    userName: string;
    loanDate: Date;
    expectedReturnDate: Date;
    returnDate: Date | null;
    status: "emprestado" | "devolvido" | "devolvido com atraso" | "extraviado";
    fine?: number;
}
