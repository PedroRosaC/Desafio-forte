import { Request, Response } from "express";
import { loanService } from "../services/LoanService";

export const getAllLoans = async (req: Request, res: Response) => {
    const loans = await loanService.findAll();
    res.json(loans);
};

export const getLoanById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const loan = await loanService.findById(id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json(loan);
};

export const createLoan = async (req: Request, res: Response) => {
    const { bookId, userName, loanDate } = req.body;
    if (!bookId || !userName || !loanDate) {
        return res.status(400).json({ message: "Missing fields" });
    }
    
    try {
        const loan = await loanService.create({ bookId, userName, loanDate });
        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: "Error creating loan" });
    }
};

export const updateLoanStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // "devolvido" or "extraviado"
    
    if (status !== "devolvido" && status !== "extraviado") {
        return res.status(400).json({ message: "Invalid status" });
    }
    
    const updated = await loanService.updateStatus(id, status);
    if (!updated) return res.status(404).json({ message: "Loan not found" });
    res.json(updated);
};

export const updateLoan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { bookId, userName, loanDate } = req.body;
    
    try {
        const updated = await loanService.update(id, { bookId, userName, loanDate });
        if (!updated) return res.status(404).json({ message: "Loan not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error updating loan" });
    }
};

export const deleteLoan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const ok = await loanService.delete(id);
    if (!ok) return res.status(404).json({ message: "Loan not found" });
    res.status(204).send();
};