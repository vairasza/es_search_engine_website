/* eslint-env browser */

const SearchEngineView = {

    //checkboxes
    checkBoxVersion: document.querySelector(".switch-input"),

    checkBoxTitle: document.querySelector(".checkbox-title"),
    checkBoxContent: document.querySelector(".checkbox-content"),
    checkBoxMediaType: document.querySelector(".checkbox-media-type"),
    checkBoxSource: document.querySelector(".checkbox-source"),
    checkBoxPublished: document.querySelector(".checkbox-published"),

    //input
    inputTitle: document.querySelector(".input-title"),
    inputContent: document.querySelector(".input-content"),
    inputMediaType: document.querySelector(".input-media-type"),
    inputSource: document.querySelector(".input-source"),
    inputPublishedFrom: document.querySelector(".input-published-from"),
    inputPublishedTo: document.querySelector(".input-published-to"),

    //button
    buttonReset: document.querySelector(".button-reset-input"),
    buttonSearchRequest: document.querySelector(".button-search-request"),
    buttonError: document.querySelector(".button-error-confirmation"),

    //container
    errorContainer: document.querySelector(".error-container"),

    renderResult (content) {
        const div = document.createElement("div"),
        parent = document.querySelector("result-container"),
        templateString = 
            `<span class="result-box-single">
                <p class="result-title">${content.title}</p>
                <p class="result-content">${content.content}</p>
                <p class="result-media-type">${content.mediaType}</p>
                <p class="result-source">${content.source}</p>
                <p class="result-published">${content.published}</p>
                <p class="result-metrics">${content.metrics}</p>
            </span>`;

        div.classList.add("result-box-single");
        div.innerHTML = templateString;

        parent.appendChild(div);
    },

    getCheckedValuesAsObject () {
        let inputValues = {
            title: (this.checkBoxTitle.checked && this.inputTitle !== "") ? this.inputTitle.value : null,
            content: (this.checkBoxContent.checked && this.inputContent !== "") ? this.inputContent.value : null,
            mediaType: (this.checkBoxMediaType.checked && this.inputMediaType !== "") ? this.inputMediaType.value : null,
            source: (this.checkBoxSource.checked && this.inputSource !== "") ? this.inputSource.value : null,
            publishedFrom: (this.checkBoxPublished.checked && this.inputPublishedFrom !== "") ? this.inputPublishedFrom.value : null,
            publishedTo: (this.checkBoxPublished.checked && this.inputPublishedTo !== "") ? this.inputPublishedTo.value : null,
        };

        for (let key in inputValues) {
            if (Object.prototype.hasOwnProperty.call(inputValues, key)) {
                if (inputValues[key] === null) {
                    delete inputValues[key];
                }
            }
        }

        return inputValues;
    },

    getButtonReset () {
        return this.buttonReset;
    },

    getButtonSearchRequest () {
        return this.buttonSearchRequest;
    },

    resetResults () {
        document.querySelector(".result-container").innerHTML = null;
    },

    resetCheckBoxes () {
        this.checkBoxTitle.checked = false;
        this.checkBoxContent.checked = false;
        this.checkBoxMediaType.checked = false;
        this.checkBoxSource.checked = false;
        this.checkBoxPublished.checked = false;
    },

    resetInputs () {
        this.inputTitle.value = "";
        this.inputContent.value = "";
        this.inputMediaType.value = "";
        this.inputSource.value = "";
        this.inputPublishedFrom.value = "";
        this.inputPublishedTo.value = "";
    },

    lockInput () {
        this.checkBoxVersion.disabled = true;

        this.checkBoxTitle.disabled = true;
        this.checkBoxContent.disabled = true;
        this.checkBoxMediaType.disabled = true;
        this.checkBoxSource.disabled = true;
        this.checkBoxPublished.disabled = true;

        this.inputTitle.disabled = true;
        this.inputContent.disabled = true;
        this.inputMediaType.disabled = true;
        this.inputSource.disabled = true;
        this.inputPublishedFrom.disabled = true;
        this.inputPublishedTo.disabled = true;
    },

    unlockInput () {
        this.checkBoxVersion.disabled = false;

        this.checkBoxTitle.disabled = false;
        this.checkBoxContent.disabled = false;
        this.checkBoxMediaType.disabled = false;
        this.checkBoxSource.disabled = false;
        this.checkBoxPublished.disabled = false;

        this.inputTitle.disabled = false;
        this.inputContent.disabled = false;
        this.inputMediaType.disabled = false;
        this.inputSource.disabled = false;
        this.inputPublishedFrom.disabled = false;
        this.inputPublishedTo.disabled = false;
    },

    showPopup (message) {
        const div = document.createElement("div");

        div.innerHTML = `<p class="error-message">${message}</p><button class="button button-error-confirmation" type="button">OK</button>`;

        this.errorContainer.appendChild(div);

        //Checks if you sent the message and if so, displays it right in the chatbox
        //eslint-disable-next-line 
        const confirmButton = document.querySelector(".button-error-confirmation");
        confirmButton.addEventListener("click", function () {
            this.errorContainer.innerHTML = null;
        }.bind(this));
    },

};

export default SearchEngineView;