/* eslint-env browser */

const Config = {
    DB_NAME: "studienleistung_ir",
    DB_NAME_TFIDF: "studienleistung_tfidf",
    ES_CONNECT_URL: "http://localhost:8001/api",
    STATUS_200: 200,
    NO_RESULT_FOUND: "No results were found!",
    NEED_SEARCH_PARAMETER: "Searching requires at least one parameter!",
    WRONG_DATE_INPUT_FUTURE: "The provided date can not be in the future!",
    WRONG_DATE_INPUT_TWIST: "The start time must be before end time!",
    WRONG_DATE_INPUT_EXIST: "Both time inputs are required!",
    VERSION_BOOL: "Boolean Query",
    VERSION_TFIDF: "TF.IDF Query",
    NUMBER_SHOWEN_ELEMENTS: 100,
};

Object.freeze(Config);

export default Config;