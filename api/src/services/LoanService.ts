import { pool } from "../db";
import { v4 as uuidv4 } from "uuid";
import { Loan } from "../models/Loan";

export function calculateExpectedReturnDate(loanDate: Date): Date {
    const returnDate = new Date(loanDate.getTime());
    returnDate.setDate(returnDate.getDate() + 30);
    
    const day = returnDate.getDay();
    if (day === 6) {
        returnDate.setDate(returnDate.getDate() + 2); 
    } else if (day === 0) {
        returnDate.setDate(returnDate.getDate() + 1); 
    }
    
    return returnDate;
}

export function calculateFine(expectedReturnDate: Date, returnDate: Date): number {
    const expected = new Date(expectedReturnDate.getFullYear(), expectedReturnDate.getMonth(), expectedReturnDate.getDate());
    const returned = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate());
    
    const timeDiff = returned.getTime() - expected.getTime();
    const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
        return 0;
    } else {
        return diffDays * 0.5;
    }
}

class LoanService {
    private async updateOverdueLoans(): Promise<void> {
        await pool.query(`
            UPDATE loans
            SET status = 'extraviado'
            WHERE status = 'emprestado' 
              AND expected_return_date < CURRENT_DATE
        `);
    }

    async findAll(): Promise<Loan[]> {
        await this.updateOverdueLoans();
        const result = await pool.query(`
            SELECT id, book_id AS "bookId", user_name AS "userName", 
                   loan_date AS "loanDate", expected_return_date AS "expectedReturnDate", 
                   return_date AS "returnDate", status
            FROM loans
        `);
        return result.rows.map(row => {
            let fine = 0;
            if (row.returnDate) {
                fine = calculateFine(new Date(row.expectedReturnDate), new Date(row.returnDate));
            } else if (row.status === "emprestado" || row.status === "extraviado") {
                fine = calculateFine(new Date(row.expectedReturnDate), new Date());
            }
            return { ...row, fine };
        });
    }

    async findById(id: string): Promise<Loan | undefined> {
        await this.updateOverdueLoans();
        const result = await pool.query(`
            SELECT id, book_id AS "bookId", user_name AS "userName", 
                   loan_date AS "loanDate", expected_return_date AS "expectedReturnDate", 
                   return_date AS "returnDate", status
            FROM loans WHERE id = $1
        `, [id]);
        
        if (result.rows.length === 0) return undefined;
        
        const row = result.rows[0];
        let fine = 0;
        if (row.returnDate) {
            fine = calculateFine(new Date(row.expectedReturnDate), new Date(row.returnDate));
        } else if (row.status === "emprestado" || row.status === "extraviado") {
            fine = calculateFine(new Date(row.expectedReturnDate), new Date());
        }
        return { ...row, fine };
    }

    async create(data: { bookId: string; userName: string; loanDate: string }): Promise<Loan> {
        const id = uuidv4();
        const [year, month, day] = data.loanDate.split('T')[0].split('-').map(Number);
        const loanDate = new Date(year, month - 1, day);
        
        const expectedReturnDate = calculateExpectedReturnDate(loanDate);
        
        await pool.query(`
            INSERT INTO loans (id, book_id, user_name, loan_date, expected_return_date, status)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [id, data.bookId, data.userName, loanDate, expectedReturnDate, "emprestado"]);
        
        return {
            id,
            bookId: data.bookId,
            userName: data.userName,
            loanDate,
            expectedReturnDate,
            returnDate: null,
            status: "emprestado",
            fine: 0
        };
    }

    async updateStatus(id: string, newStatus: "devolvido" | "extraviado"): Promise<Loan | null> {
        const loan = await this.findById(id);
        if (!loan) return null;
        
        const returnDate = new Date();
        let finalStatus: string = newStatus;
        
        if (newStatus === "devolvido") {
            const expected = new Date(loan.expectedReturnDate);
            const expDate = new Date(expected.getFullYear(), expected.getMonth(), expected.getDate());
            const retDate = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate());
            if (retDate.getTime() > expDate.getTime()) {
                finalStatus = "devolvido com atraso";
            }
        }
        
        await pool.query(`
            UPDATE loans 
            SET status = $1, return_date = $2
            WHERE id = $3
        `, [finalStatus, returnDate, id]);
        
        return { ...loan, status: finalStatus as any, returnDate, fine: calculateFine(new Date(loan.expectedReturnDate), returnDate) };
    }

    async update(id: string, data: { bookId?: string; userName?: string; loanDate?: string }): Promise<Loan | null> {
        const loan = await this.findById(id);
        if (!loan) return null;
        
        let newExpectedReturnDate = loan.expectedReturnDate;
        let newLoanDate = loan.loanDate;

        if (data.loanDate) {
            const [year, month, day] = data.loanDate.split('T')[0].split('-').map(Number);
            newLoanDate = new Date(year, month - 1, day) as any;
            newExpectedReturnDate = calculateExpectedReturnDate(newLoanDate as any);
        }

        const updatedBookId = data.bookId || loan.bookId;
        const updatedUserName = data.userName || loan.userName;

        await pool.query(`
            UPDATE loans 
            SET book_id = $1, user_name = $2, loan_date = $3, expected_return_date = $4
            WHERE id = $5
        `, [updatedBookId, updatedUserName, newLoanDate, newExpectedReturnDate, id]);

        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await pool.query('DELETE FROM loans WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

export const loanService = new LoanService();