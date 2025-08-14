import express, { Application, Request, Response } from "express";
import cors from "cors";
// import { borrowBookRoutes } from "./app/modules/library/borrow/borrow.route";
// import { bookRoutes } from "./app/modules/library/book/book.route";
// import { borrowBookRoutes } from "./app/modules/library/borrow/borrow.route";
// import { UserRoutes } from "./app/modules/ph-tour/user/user.routes";
import { router } from "./app/routes";
// import { envVars } from "./config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./config/passport";
import { envVars } from "./config/env";

const app: Application = express();

// Configure CORS properly
// app.use(cors({ origin: "*" }));

// Parse JSON and URL-encoded bodies

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//.json body parsers
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);
// Routes
// app.use("/api/books", bookRoutes);
// app.use("/api/borrow", borrowBookRoutes);
app.use("/api/v1", router);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome, HP-Tour-Management-Server is running!");
});

// unHandle error.
//unCaught error handler
//single termination sigterm

// 404 হ্যান্ডলার
app.use(notFound);

// এরর হ্যান্ডলিং মিডলওয়্যার
app.use(globalErrorHandler);

export default app;
