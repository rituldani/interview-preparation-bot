import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import GenerateRoute from "./src/routes/Generate.Route.js"
import RecordRouter from "./src/routes/Transcribe.Route.js"
import EvaluateRouter from "./src/routes/Evaluate.Route.js"
const app = express()
dotenv.config()

// const allowedOrigins = ['https://interview-preparation-bot-frontend.onrender.com', 'http://localhost:5173',];
const allowedOrigins = [process.env.CLIENT_URL, process.env.PROD_CLIENT_URL];
// allowedOrigins || 
app.use(cors({
  // origin: 'http://localhost:5173',
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser());

app.use('/api/generator', GenerateRoute)
app.use('/api/record', RecordRouter)
app.use('/api/evaluation', EvaluateRouter)
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
//  console.log(`Server running on http://0.0.0.0:${PORT}`);
