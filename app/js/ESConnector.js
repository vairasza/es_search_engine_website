/* eslint-env browser */

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

    return { database: "studienleistung_test", request: newQuery };
}

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
            metrics: "score: " +item. _score + " | id: " + item._id,
        });
    });

    return response;
}

const ESConnector = {

    esConnectUrl: "http://localhost:8001/api",
    //needs implementation for second elasticsearch database
    version: true,

    async makeQuery (query, callback) {

        const processedQuery = processQuery(query);

        const result = await fetchAPI(this.esConnectUrl, processedQuery, "POST");

        if (result.status === 200) {

            const processedResult = processResult(result);

            callback(processedResult);
        }
        else {
            callback(null);
        }
    },

};

export default ESConnector;