var processed = {};

function tryPlay(row) {
    if(processed[row[0]])
        return;

    processed[row[0]] = true;
    var audio = new Audio(row[2]);
    audio.play();
}

function checkQueue() {
    fetch(
        "/api/queue",
        {
            method: "POST",
            body: ""
        }
    )
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setTimeout(checkQueue, 100);
            for(let row of data)
                tryPlay(row);
        });
}

window.onload = () => {
    checkQueue();
    document.body.innerText = "";
}