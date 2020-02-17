const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const security = require("./api/routes/security");
const userRoutes = require("./api/routes/users");
const save = require('./api/routes/saveFileRouter');

let url = `${process.env.DATABASE}://${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE_NAME}`;

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

if (process.env.NODE_ENV === 'Development') {
    require('./config').config();
}

mongoose.connect(
    url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) {
            console.log("mongo connection error.");
        };
        console.log("mongo connected");
    }
);

// Routes which should handle requests
app.use("/security", security);
app.use("/users", userRoutes);
app.use("/save", save);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;