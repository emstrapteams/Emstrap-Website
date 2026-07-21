const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const contactRoute = require("./routes/contact");

const app = express();
app.set("trust proxy", 1);

app.use(helmet());

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", limiter);

app.use("/api/contact", contactRoute);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "EMSTRAP Backend Running"
    });
});

app.use((err, req, res, next) => {
    if (err && err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON payload."
        });
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal server error."
    });
});

const PORT = process.env.PORT || 5000;

const startServer = () => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
            console.error(`Port ${PORT} is already in use. Please stop the other server or use a different port.`);
        } else {
            console.error("Server startup failed:", error);
        }
        process.exit(1);
    });
};

startServer();
