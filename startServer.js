/* eslint-env node */
const express = require("express");
const app = express();
const port = 8001;

process.title = "es_search_engine";

app.use(express.static("app"));

app.all("*", (req, res) => {
    res.status(404).json({status: "404", message: "Not Found!"});
});

app.listen(port, () => {
    //eslint-disable-next-line
    console.log(`ES Search Engine running at http://localhost:${port}`);
});