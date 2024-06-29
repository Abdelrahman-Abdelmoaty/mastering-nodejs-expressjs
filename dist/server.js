"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_1 = __importDefault(require("./routes/posts"));
const auth_1 = __importDefault(require("./routes/auth"));
const logger_1 = __importDefault(require("./middlewares/logger"));
const error_1 = __importDefault(require("./middlewares/error"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// env
dotenv_1.default.config();
// Express
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// cors
const corsOptions = {
    credentials: true,
    origin: ["http://localhost:5173"],
};
app.use((0, cors_1.default)(corsOptions));
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middlewares
// Logger
app.use(logger_1.default);
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/posts", posts_1.default);
// Error handler
app.use(notFound_1.default);
app.use(error_1.default);
// Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map