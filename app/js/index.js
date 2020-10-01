/* eslint-env browser */
import ESConnector from "./ESConnector.js";
import SearchEngineView from "./SearchEngineView.js";

function init () {
    SearchEngineView.getButtonReset().addEventListener("click", resetInput);
    SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
}

function resetInput () {
    SearchEngineView.resetCheckBoxes();
    SearchEngineView.resetInputs();
}

function makeQuery () {
    SearchEngineView.lockInput();
    SearchEngineView.getButtonReset().removeEventListener("click", resetInput);
    SearchEngineView.getButtonSearchRequest().removeEventListener("click", makeQuery);

    const values = SearchEngineView.getCheckedValuesAsObject();

    ESConnector.makeQuery(values, (result) => {
        if (result) {
            //free space for new results
            SearchEngineView.resetResults();
            result.forEach(item => SearchEngineView.renderResults(item));
        }
        else {
            //show error message or something
            SearchEngineView.showPopup("The query resulted in an error!");
        }

        SearchEngineView.getButtonReset().addEventListener("click", resetInput);
        SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
        SearchEngineView.unlockInput();
    });
    
}

init();