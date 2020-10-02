/* eslint-env browser */
import ESConnector from "./ESConnector.js";
import SearchEngineView from "./SearchEngineView.js";

function init () {
    SearchEngineView.getButtonReset().addEventListener("click", resetInput);
    SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
    SearchEngineView.versionSwitch.addEventListener("click", switchVersion);
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

    if (Object.keys(values).length > 0) {
        ESConnector.makeQuery(values, (result) => {

            if (result !== null && Object.keys(result).length !== 0) {
                //free space for new results
                SearchEngineView.resetResults();
                
                result.forEach(item => SearchEngineView.renderResult(item));

                SearchEngineView.getButtonReset().addEventListener("click", resetInput);
                SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
                SearchEngineView.unlockInput();
            }
            else {
                //show error message or something
                SearchEngineView.showPopup("No results found!", () => {
                    SearchEngineView.getButtonReset().addEventListener("click", resetInput);
                    SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
                    SearchEngineView.unlockInput();
                });
            }
        });
    }
    else {
        SearchEngineView.showPopup("Searching requires at least one parameter!", () => {
            SearchEngineView.getButtonReset().addEventListener("click", resetInput);
            SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
            SearchEngineView.unlockInput();
        });
    }
}

function switchVersion (event) {
    //change text to what ever versions we are using
    SearchEngineView.versionText.innerHTML = (event.target.checked) ? "2" : "1";
    ESConnector.version = !ESConnector.version;
}

init();