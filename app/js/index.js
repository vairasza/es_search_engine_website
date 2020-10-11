/* eslint-env browser */
import ESConnector from "./ESConnector.js";
import SearchEngineView from "./SearchEngineView.js";
import Config from "./Config.js";

function init () {
    SearchEngineView.getButtonReset().addEventListener("click", resetInput);
    SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
    SearchEngineView.versionSwitch.addEventListener("click", switchVersion);

    //unchecks must/should checkbox if sibling has been selected
    SearchEngineView.checkBoxMediaTypeMust.addEventListener("change", () => {
        SearchEngineView.uncheckMediaTypeShould();
    });
    SearchEngineView.checkBoxMediaTypeShould.addEventListener("change", () => {
        SearchEngineView.uncheckMediaTypeMust();
    });
    SearchEngineView.checkBoxSourceMust.addEventListener("change", () => {
        SearchEngineView.uncheckSourceShould();
    });
    SearchEngineView.checkBoxSourceShould.addEventListener("change", () => {
        SearchEngineView.uncheckSourceMust();
    });

    //handles info icon popup click events
    SearchEngineView.modalInfoIcon.addEventListener("click", () => {
        SearchEngineView.showModal();
    });
}

function resetInput () {
    SearchEngineView.resetCheckBoxes();
    SearchEngineView.resetInputs();
}

function makeQuery () {
    //first check if date input is valid (both fields have input and chronologic)
    checkValidDateInput((result) => {
        if (result.status) {
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
                        SearchEngineView.showPopup(Config.NO_RESULT_FOUND, () => {
                            SearchEngineView.getButtonReset().addEventListener("click", resetInput);
                            SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
                            SearchEngineView.unlockInput();
                        });
                    }
                });
            }
            else {
                SearchEngineView.showPopup(Config.NEED_SEARCH_PARAMETER, () => {
                    SearchEngineView.getButtonReset().addEventListener("click", resetInput);
                    SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
                    SearchEngineView.unlockInput();
                });
            }
        }
        else {
            SearchEngineView.showPopup(result.message, () => {
                SearchEngineView.getButtonReset().addEventListener("click", resetInput);
                SearchEngineView.getButtonSearchRequest().addEventListener("click", makeQuery);
                SearchEngineView.unlockInput();
            });
        }
    });
    
}

function checkValidDateInput (callback) {
    const start = SearchEngineView.inputPublishedFrom.value,
    end = SearchEngineView.inputPublishedTo.value,
    //code reference: https://stackoverflow.com/a/37649046
    today = new Date().toLocaleString("en-us", {year: "numeric", month: "2-digit", day: "2-digit"}).replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2");
    //format of time input value: 2020-10-13

    if (!SearchEngineView.checkBoxPublished.checked) {
        callback({ status: true });
    }
    //one of the input terms does not exist
    else if (!start || !end) {
        callback({ status: false, message: Config.WRONG_DATE_INPUT_EXIST});
    }
    //check if start is earlier than end
    else if (start > end) {
        callback({ status: false, message: Config.WRONG_DATE_INPUT_TWIST});
    }
    //check if input terms are in the future
    else if (start > today || end > today) {
        callback({ status: false, message: Config.WRONG_DATE_INPUT_FUTURE});
    }
    else {
        callback({ status: true });
    }
}

function switchVersion (event) {
    //change text to what ever versions we are using
    SearchEngineView.versionText.innerHTML = (event.target.checked) ? Config.VERSION_TFIDF : Config.VERSION_BOOL;
    ESConnector.version = !ESConnector.version;
}

init();