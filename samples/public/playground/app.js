
async function send() {
    const prompt = document.querySelector("#prompt").value;

    const response = await fetch("/api/general", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt})
    })
    const output = await response.json();
    document.querySelector("output").textContent = output;


}