var processedAudio = {};
var processedGraphics = {};

function tryPlay(row) {
    if(processedAudio[row[0]])
        return;

    processedAudio[row[0]] = true;
    var audio = new Audio(row[2]);
    audio.play();
}

function tryRender(row) {
    if(processedGraphics[row[0]])
        return;

    processedGraphics[row[0]] = true;

    if(row[2] == "gfx") {
        let img = document.createElement("img");
        img.src = row[1];
        img.style.position = "fixed";
        img.style.left = `${row[4]}%`;
        img.style.top = `${row[5]}%`;
        img.style.width = `${row[6]}%`;
        img.style.height = "auto";
        if(row[8]) {
            img.style.transition = "opacity 1s";
            img.style.opacity = "0%";
            setTimeout(
                () => img.style.opacity = "100%",
                50
            );
        }

        setTimeout(
            () => {
                if(row[8]) {
                    img.style.opacity = "0%";
                    setTimeout(
                        () => img.remove(),
                        1000
                    )
                } else {
                    img.remove();
                }
            },
            row[9] * 1000
        )
        document.body.appendChild(img);
    }
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
            setTimeout(checkQueue, 100);

            for(let row of data.sounds)
                tryPlay(row);

            for(let row of data.graphics)
                tryRender(row);
        })
        .catch(() => {
            setTimeout(checkQueue, 5000);
        });
}

window.onload = () => {
    checkQueue();
    document.body.innerText = "";
}