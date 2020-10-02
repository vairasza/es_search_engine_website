/* eslint-env browser */
import Config from "./Config.js";

async function fetchAPI (url, body, method) {
    try {
        return await fetch(url, {
            method: method,
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then(response => response.json()); 
    }
    catch (err) {
        return err;
    }
}

/* builds a query for elasticsearch search with parameters from input fields */
function processQuery (query) {
    let newQuery = {
        "query": {
            "bool": {
                "must": [],
            },
        },
    };

    if (query.title) {
        newQuery.query.bool.must.push({ "match": { "title": query.title }});
    }

    if (query.content) {
        newQuery.query.bool.must.push({ "match": { "content": query.content }});
    }

    if (query.mediaType) {
        newQuery.query.bool.must.push({ "match": { "media-type": query.mediaType }});
    }

    if (query.source) {
        newQuery.query.bool.must.push({ "match": { "source": query.source }});
    }

    if (query.publishedFrom) {
        newQuery.query.bool.must.push({
            "range": { 
                "published": {
                    "gte": query.publishedFrom,
                    "lte": query.publishedTo,
                },
            },
        });         
    }

    return { database: Config.DB_NAME, request: newQuery };
}

/* remodeling data from server in order to use them properly in the render template */
function processResult (result) {
    let response = [];

    result.body.body.hits.hits.forEach(item => {
        /* eslint no-underscore-dangle: 0 */
        response.push({
            title: item._source.title,
            content: item._source.content,
            mediaType: item._source["media-type"],
            source: item._source.source,
            published: item._source.published,
            metrics: "score: " + item. _score + " | id: " + item._id,
        });
    });

    return response;
}

const ESConnector = {
    //needs implementation for second elasticsearch database
    version: true,

    async makeQuery (query, callback) {

        const processedQuery = processQuery(query);

        const result = await fetchAPI(Config.ES_CONNECT_URL, processedQuery, "POST");

        if (result.status === Config.STATUS_200) {

            const processedResult = processResult(result);

            callback(processedResult);
        }
        else {
            callback(null);
        }
    },

};

export default ESConnector;