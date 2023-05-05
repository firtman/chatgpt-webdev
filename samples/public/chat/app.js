const OPENAI_KEY = "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";
const price = 0.0002/1000;

const messages = [];
let totalTokens = 0;

async function sendChat() {
    const prompt = document.querySelector("#prompt").value;
    document.querySelector("#prompt").value = "";
   
    // TODO make query and parse results

    document.querySelector("#prompt").value = "";
    document.querySelector("input").focus();
}