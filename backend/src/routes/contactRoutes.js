import { Router } from "express";
import { handleContactForm } from "../controllers/contactController.js";

const router = Router();

router.post("/", handleContactForm);

export default router;
