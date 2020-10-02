/* eslint-env node */
const express = require("express");
const { Client } = require("@elastic/elasticsearch");
const bodyParser = require("body-parser");
const client = new Client({ node: "http://localhost:9200"});
const app = express();
const port = 8001;

process.title = "es_search_engine";

app.use(express.static("app"));
app.use(bodyParser.json());

app.post("/api", async (req, res) => {

    try {
        const result = await client.search({
            index: req.body.database,
            body: req.body.request,
        });

        res.json({
            status: 200,
            body: result,
        });
    }
    catch (err) {
        res.json({
            status: 500,
            body: err,
        });
    }

});

app.listen(port, () => {
    //eslint-disable-next-line
    console.log(`ES Search Engine running at http://localhost:${port}`);
});