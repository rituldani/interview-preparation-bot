import express from "express"
import { Evaluation } from "../controllers/evaluation.controller.js";

const router = express.Router();

router.post('/evaluate', Evaluation)

export default router;