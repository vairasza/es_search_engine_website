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
function processQueryBoolean (query) {
    let newQuery = {
        "query": {
            "bool": {},
        },
        "size": Config.NUMBER_SHOWEN_ELEMENTS,
    };

    //title/content: write each term seperated with comma, start term with ! -> must not, ? -> should
    //diff query.mediatype must/should; query.source must/should

    //add must, should, must not if needed
    if (query.title || query.content || query.mediaType || query.source || query.publishedFrom) {
        newQuery.query.bool.must = [];
    }

    if ((query.mediaType && query.mediaType.should) || (query.source && query.source.should) || (query.title && (/\?/).test(query.title)) || (query.content && (/\?/).test(query.content))) {
        newQuery.query.bool.should = [];
    }

    if ((query.title && (/!/).test(query.title)) || (query.content && (/!/).test(query.content))) {
        newQuery.query.bool.must_not = [];
    }

    //add content from inputs to query object
    //split title and content
    if (query.title) {
        let words = query.title.split(", ");

        words.forEach(item => {
            let word = item;

            if ((/^!.*$/).test(word)) {
                word = word.substring(1).trim();
                newQuery.query.bool.must_not.push({ "match": { "title": word }});
            }
            else if ((/^\?.*$/).test(word)) {
                word = word.substring(1).trim();
                newQuery.query.bool.should.push({ "match": { "title": word }});
            }
            else {
                word = word.trim();
                newQuery.query.bool.must.push({ "match": { "title": word }});
            }
        });
    }

    if (query.content) {
        let words = query.content.split(", ");

        words.forEach(item => {
            let word = item;

            if ((/^!.*$/).test(word)) {
                word = word.substring(1).trim();
                newQuery.query.bool.must_not.push({ "match": { "content": word }});
            }
            else if ((/^\?.*$/).test(word)) {
                word = word.substring(1).trim();
                newQuery.query.bool.should.push({ "match": { "content": word }});
            }
            else {
                word = word.trim();
                newQuery.query.bool.must.push({ "match": { "content": word }});
            }
        });
    }

    if (query.mediaType && query.mediaType.value) {
        if (query.mediaType.must) {
            newQuery.query.bool.must.push({ "match": { "media-type": query.mediaType.value }});
        }
        else {
            newQuery.query.bool.should.push({ "match": { "media-type": query.mediaType.value }});
        }
       
    }

    if (query.source && query.source.value) {
        if (query.source.must) {
            newQuery.query.bool.must.push({ "match": { "source": query.source.value }});
        }
        else {
            newQuery.query.bool.should.push({ "match": { "source": query.source.value }});
        }
    }

    //require range
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

function processQueryTFIDF(query){
    let newQuery = {
        "query": {
            "bool": {
                "should": [],
            },
        },
        "size": Config.NUMBER_SHOWEN_ELEMENTS,
    };

    if(query.title){
        newQuery.query.bool.should.push({"match": {"title": query.title}});
    }

    if(query.content){
        newQuery.query.bool.should.push({"match": {"content": query.content}});
    }

    if(query.mediaType.value){
        newQuery.query.bool.should.push({"match": {"media-type": query.mediaType.value}});
    }

    if(query.source.value){
        newQuery.query.bool.should.push({"match": {"source": query.source.value}});
    }

    if (query.publishedFrom) {
        newQuery.query.bool.should.push({
            "range": { 
                "published": {
                    "gte": query.publishedFrom,
                    "lte": query.publishedTo,
                },
            },
        });         
    }

    return {database: Config.DB_NAME_TFIDF, request: newQuery};
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
        const processedQuery = (this.version) ? processQueryBoolean(query) : processQueryTFIDF(query),
        result = await fetchAPI(Config.ES_CONNECT_URL, processedQuery, "POST");

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