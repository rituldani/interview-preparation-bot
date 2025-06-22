import express from "express"
import multer from "multer";
import { Recorder } from "../controllers/record.controller.js";
import path from 'path';
import crypto from 'crypto';

const router = express.Router();

// Setup Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ✅ Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // e.g., .mp3, .wav
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


router.post('/transcribe', upload.single('audio'), Recorder)

export default router;