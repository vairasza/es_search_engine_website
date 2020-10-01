/* eslint-env browser */

async function fetchAPI (url, body, method) {
    try {
        return await fetch(url, {
            method: method,
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        })
        .then(response => response.json()); 
    }
    catch (err) {
        return err;
    }
}

function processQuery (query) {
    //form input object so that it will be accepted by elasticsearch

    return query;
}

function processResult (result) {
    //bring response into form so renderresult can render template with valid values

    return result;
}

const ESConnector = {

    esConnectUrl: "http://localhost:9200",

    async makeQuery (query, callback) {
        const processedQuery = processQuery(query);

        const result = await fetchAPI(this.esConnectUrl, processedQuery, "GET");

        if (result) {
            const processedResult = processResult(result);

            callback(processedResult);
        }
        else {
            callback(null);
        }
    },

};

export default ESConnector;