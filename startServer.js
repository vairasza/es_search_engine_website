/* eslint-env node */

/* constants */
const ES_CONNECT_URL = "http://localhost:9200";
const NODE_APP_TITLE = "es_search_engine";
const PORT = 8001;

/* imports */
const express = require("express");
const { Client } = require("@elastic/elasticsearch");
const bodyParser = require("body-parser");

/* declarations */
const client = new Client({ node: ES_CONNECT_URL });
const app = express();

process.title = NODE_APP_TITLE;

/* serve app folder to client */
app.use(express.static("app"));
/* allows fetch to append body */
app.use(bodyParser.json());

/* api that transfers query to server in order to use elasticsearch node package */
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

app.listen(PORT, () => {
    //eslint-disable-next-line
    console.log(`ES Search Engine running at http://localhost:${PORT}`);
});