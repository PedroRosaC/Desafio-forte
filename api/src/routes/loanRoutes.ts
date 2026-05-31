import { Router } from "express";
import {
    getAllLoans,
    getLoanById,
    createLoan,
    updateLoanStatus,
    updateLoan,
    deleteLoan,
} from "../controllers/LoanController";

const router = Router();

router.get("/", getAllLoans);
router.get("/:id", getLoanById);
router.post("/", createLoan);
router.put("/:id", updateLoan);
router.patch("/:id/status", updateLoanStatus);
router.delete("/:id", deleteLoan);

export default router;