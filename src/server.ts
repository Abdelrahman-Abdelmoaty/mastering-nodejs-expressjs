import express from "express";
import posts from "./routes/posts";
import auth from "./routes/auth";
import logger from "./middlewares/logger";
import errorHandler from "./middlewares/error";
import notFound from "./middlewares/notFound";
import "./utils/db";
// import authenticate from "./middlewares/authenticate";

// env
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(logger);
// app.use(authenticate);

// Routes
app.use("/api/auth", auth);
app.use("/api/posts", posts);

// Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
