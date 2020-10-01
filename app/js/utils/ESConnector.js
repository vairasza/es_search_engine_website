/* eslint-env browser */
import Config from "../utils/Config.js";

async function fetchAPI (body, method) {
    try {
        return await fetch(Config.ES_URL_LOCAL, {
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

const ESConnector = {
    //todo
    async getDefault (query, callback) {
        const result = await fetchAPI(query);

        console.log(result);
        if (result) {
            callback({ /* result */ });
        }
        else {
            callback({ /* return error message */ });
        }
    },

    async getTFIDF () {
        //
    },

};

export default ESConnector;