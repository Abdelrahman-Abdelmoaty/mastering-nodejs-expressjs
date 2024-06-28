import express from "express";
import posts from "./routes/posts";
import auth from "./routes/auth";
import logger from "./middlewares/logger";
import errorHandler from "./middlewares/error";
import notFound from "./middlewares/notFound";
import cors from "cors";
import dotenv from "dotenv";

// env
dotenv.config();

// Express
const app = express();
const port = process.env.PORT || 8080;

// cors
const corsOptions = {
	credentials: true,
	origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares

// Logger
app.use(logger);

// Routes
app.use("/api/auth", auth);
app.use("/api/posts", posts);

// Error handler
app.use(notFound);
app.use(errorHandler);

// Server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
