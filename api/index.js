import express from "express";
import env from "dotenv";
// import "express-async-errors";
import connectDb from "./DB/connect.js";

import authRouter from "./Router/auth_route.js";
import passwordRouter from "./Router/password_route.js";
import authMiddleware from "./Middleware/Authenticate.js";
import routeNotFoundErrMid from "./Middleware/RouteNotFoundErrMid.js";
import errorHandler from "./Middleware/ErrorHandler.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
// import xss from "xss-clean";
import rateLimit from "express-rate-limit";

env.config();
const app = express();

app.set("trust proxy", 1);
app.set('query parser', 'simple'); // Default parser

// cors header
app.use((req, res, next) => {
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Essential Middlewares
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(xss());
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/api/", (req, res) => res.send("<center><h1>Password Manager - API</h1></center>"));
app.use("/api/auth", authRouter);
app.use("/api/passwords", authMiddleware, passwordRouter);
app.use("/api/welcome", authMiddleware, (req, res) => { res.status(200).json(req.user); });

// Error Handler Middlewares 
app.use(routeNotFoundErrMid);
app.use(errorHandler);

const port = process.env.PORT || 5000;
(async () => {
    try {
        await connectDb(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server's Listening on port ${port}...`));
    } catch (error) { console.error(error); }
})();