import { Router } from "express";
import {
    getAllLoans,
    getLoanById,
    createLoan,
    updateLoanStatus,
    deleteLoan,
} from "../controllers/LoanController";

const router = Router();

router.get("/", getAllLoans);
router.get("/:id", getLoanById);
router.post("/", createLoan);
router.patch("/:id/status", updateLoanStatus);
router.delete("/:id", deleteLoan);

export default router;