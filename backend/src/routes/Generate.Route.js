import express from "express"
import { QuestionGenerator } from "../controllers/question.controller.js";

const router = express.Router();

router.post('/questions', QuestionGenerator);

export default router;