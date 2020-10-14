/* eslint-env browser */

const SearchEngineView = {

    //checkboxes
    checkBoxVersion: document.querySelector(".switch-input"),

    checkBoxTitle: document.querySelector(".checkbox-title"),
    checkBoxContent: document.querySelector(".checkbox-content"),

    checkBoxMediaTypeMust: document.querySelector(".checkbox-media-type-must"),
    checkBoxMediaTypeShould: document.querySelector(".checkbox-media-type-should"),
    checkBoxSourceMust: document.querySelector(".checkbox-source-must"),
    checkBoxSourceShould: document.querySelector(".checkbox-source-should"),

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
    buttonModal: document.querySelector(".button-close-modal"),

    //container
    errorContainer: document.querySelector(".error-container"),

    //version switch
    versionSwitch: document.querySelector(".switch-input"),
    versionText: document.querySelector(".es-search-version"),

    //modal
    modal: document.querySelector(".modal"),
    modalInfoIcon: document.querySelector(".info-icon"),

    /* renders processed result from elasticsearch query with fix template */
    renderResult (content) {
        const div = document.createElement("div"),
        parent = document.querySelector(".result-container"),
        templateString = 
            `<p class="result-title">${content.title}</p>
            <p class="result-content">${content.content}</p>
            <div class="result-infos">
                <span class="result-media-type first-element"><u>Media Type:</u> ${content.mediaType}</span>
                <span class="result-source mid-element"><u>Source:</u> ${content.source}</span>
                <span class="result-published last-element"><u>Published:</u> ${content.published}</span>
            </div>
            <p class="result-metrics"><u>Metrics:</u> ${content.metrics}</p>`;

        div.classList.add("result-box-single");
        div.innerHTML = templateString;

        parent.appendChild(div);
    },

    /* reads values from input fields that have a checked checkbox and puts them into an object */
    getCheckedValuesAsObject (version) {
        let inputValues;
        if(version){
            inputValues = {
                title: (this.checkBoxTitle.checked && this.inputTitle !== "") ? this.inputTitle.value : null,
                content: (this.checkBoxContent.checked && this.inputContent !== "") ? this.inputContent.value : null,
                mediaType: ((this.checkBoxMediaTypeMust.checked || this.checkBoxMediaTypeShould.checked) && this.inputMediaType !== "") ? { value: this.inputMediaType.value, must: this.checkBoxMediaTypeMust.checked, should: this.checkBoxMediaTypeShould.checked } : null,
                source: ((this.checkBoxSourceMust.checked || this.checkBoxSourceShould.checked) && this.inputSource !== "") ? { value: this.inputSource.value, must: this.checkBoxSourceMust.checked, should: this.checkBoxSourceShould.checked } : null,
                publishedFrom: (this.checkBoxPublished.checked && this.inputPublishedFrom !== "") ? this.inputPublishedFrom.value : null,
                publishedTo: (this.checkBoxPublished.checked && this.inputPublishedTo !== "") ? this.inputPublishedTo.value : null,
            };
        }
        else{
            inputValues = {
                title: (this.inputTitle !== "") ? this.inputTitle.value : null,
                content: (this.inputContent !== "") ? this.inputContent.value : null,
                mediaType: (this.inputMediaType !== "") ? { value: this.inputMediaType.value, must: this.checkBoxMediaTypeMust.checked, should: this.checkBoxMediaTypeShould.checked } : null,
                source: (this.inputSource !== "") ? { value: this.inputSource.value, must: this.checkBoxSourceMust.checked, should: this.checkBoxSourceShould.checked } : null,
                publishedFrom: (this.inputPublishedFrom !== "") ? this.inputPublishedFrom.value : null,
                publishedTo: (this.inputPublishedTo !== "") ? this.inputPublishedTo.value : null,
            };
        }
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

    //eventlistener sets checkbox to false if sibling checkbox has been checked
    uncheckMediaTypeMust () {
        this.checkBoxMediaTypeMust.checked = false;
    },

    uncheckMediaTypeShould () {
        this.checkBoxMediaTypeShould.checked = false;
    },
    uncheckSourceMust () {
        this.checkBoxSourceMust.checked = false;
    },
    uncheckSourceShould () {
        this.checkBoxSourceShould.checked = false;
    },

    resetCheckBoxes () {
        this.checkBoxTitle.checked = false;
        this.checkBoxContent.checked = false;
        this.checkBoxMediaTypeMust.checked = false;
        this.checkBoxMediaTypeShould.checked = false;
        this.checkBoxSourceMust.checked = false;
        this.checkBoxSourceShould.checked = false;
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
        this.checkBoxMediaTypeMust.disabled = true;
        this.checkBoxMediaTypeShould.disabled = true;
        this.checkBoxSourceMust.disabled = true;
        this.checkBoxSourceShould.disabled = true;
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
        this.checkBoxMediaTypeMust.disabled = false;
        this.checkBoxMediaTypeShould.disabled = false;
        this.checkBoxSourceMust.disabled = false;
        this.checkBoxSourceShould.disabled = false;
        this.checkBoxPublished.disabled = false;

        this.inputTitle.disabled = false;
        this.inputContent.disabled = false;
        this.inputMediaType.disabled = false;
        this.inputSource.disabled = false;
        this.inputPublishedFrom.disabled = false;
        this.inputPublishedTo.disabled = false;
    },

    /* shows popup with messages and ok-button if missing parameters or no results found */
    showPopup (message, callback) {
        const div = document.createElement("div");

        div.innerHTML = `<p class="error-message">${message}<button class="button button-error-confirmation" type="button">OK</button></p>`;

        this.errorContainer.appendChild(div);
        this.errorContainer.classList.remove("hidden");

        //Checks if you sent the message and if so, displays it right in the chatbox
        //eslint-disable-next-line 
        const confirmButton = document.querySelector(".button-error-confirmation");
        confirmButton.addEventListener("click", function () {
            this.errorContainer.innerHTML = null;
            this.errorContainer.classList.add("hidden");
            callback();
        }.bind(this));
    },

    showModal () {
        this.modal.classList.remove("hidden");
        this.buttonModal.addEventListener("click", function () {
            hideModal(this.modal);
        }.bind(this));

    },

    changeHideCheckbox(version){
        if(version){
            this.checkBoxTitle.classList.remove("hidden");
            this.checkBoxContent.classList.remove("hidden");
            this.checkBoxMediaTypeMust.classList.remove("hidden");
            this.checkBoxMediaTypeShould.classList.remove("hidden");
            this.checkBoxSourceMust.classList.remove("hidden");
            this.checkBoxSourceShould.classList.remove("hidden");
            this.checkBoxPublished.classList.remove("hidden");
        }
        else{
            this.checkBoxTitle.classList.add("hidden");
            this.checkBoxContent.classList.add("hidden");
            this.checkBoxMediaTypeMust.classList.add("hidden");
            this.checkBoxMediaTypeShould.classList.add("hidden");
            this.checkBoxSourceMust.classList.add("hidden");
            this.checkBoxSourceShould.classList.add("hidden");
            this.checkBoxPublished.classList.add("hidden");
        }
        
    },

};

function hideModal (modal) {
    modal.classList.add("hidden");
}

export default SearchEngineView;