"use strict";

const app = require('./app.js')
const { PORT } = require("./config.js")

app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`)
});