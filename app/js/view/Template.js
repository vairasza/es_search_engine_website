/* eslint-env browser */

const Template = (message_json) => {
    const entryTemplateContent = document.querySelector("#message-template-entry").innerHTML,
         
    createEntryTemplate = _.template(entryTemplateContent),

    messages = document.querySelector(".messages"),
    
    entryNode = document.createElement("div");
    entryNode.innerHTML = createEntryTemplate(message_json);

    messages.appendChild(entryNode);
    messages.scrollTop = messages.scrollHeight;
};

export default Template;