"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import { borrowBookRoutes } from "./app/modules/library/borrow/borrow.route";
// import { bookRoutes } from "./app/modules/library/book/book.route";
// import { borrowBookRoutes } from "./app/modules/library/borrow/borrow.route";
// import { UserRoutes } from "./app/modules/ph-tour/user/user.routes";
const routes_1 = require("./app/routes");
// import { envVars } from "./config/env";
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./config/passport");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
// Configure CORS properly
// app.use(cors({ origin: "*" }));
// Parse JSON and URL-encoded bodies
app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//.json body parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: env_1.envVars.FRONTEND_URL,
    credentials: true,
}));
// Routes
// app.use("/api/books", bookRoutes);
// app.use("/api/borrow", borrowBookRoutes);
app.use("/api/v1", routes_1.router);
// Root route
app.get("/", (req, res) => {
    res.send("Welcome, HP-Tour-Management-Server is running!");
});
// unHandle error.
//unCaught error handler
//single termination sigterm
// 404 হ্যান্ডলার
app.use(notFound_1.default);
// এরর হ্যান্ডলিং মিডলওয়্যার
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
