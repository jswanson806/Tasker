const express = require('express');
const cors = require('cors');

const { NotFoundError } = require('./expressError.js');
const { authenticateJWT } = require("./middleware/auth.js");

const usersRoutes = require("./routes/users.js");
const jobsRoutes = require("./routes/jobs.js");
const messagesRoutes = require("./routes/messages.js");
const authRoutes = require("./routes/auth.js");
const paymentRoutes = require("./routes/payments.js");
const fileStorageRoutes = require("./routes/s3.js");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);
app.use(morgan("tiny"));

app.use("/users", usersRoutes);
app.use("/jobs", jobsRoutes);
app.use("/messages", messagesRoutes);
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);
app.use("/file-storage", fileStorageRoutes);


/** handle 404 errors; matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** generic error handler; catches anything unhandled */
app.use(function(err, req, res, next) {
    if(process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;