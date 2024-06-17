function createButton(uuid, name, color, width, modules) {
    let buttons = document.getElementById("buttons");    
    let button = document.createElement("button");
    buttons.appendChild(button);

    button.onclick = () => fetch(
        `/api/activate/${uuid}`,
        {
            method: "POST",
            body: "{}"
        }
    );
    button.innerText = name;
    button.style.backgroundColor = color;
    button.className = "p-1";

    if(width < 2) {
        button.className += " fourth";
    } else if(width < 3) {
        button.className += " half";
    } else if(width < 4) {
        button.className += " three-fourth";
    } else {
        button.className += " full";
    }
}

function loadButtons() {
    fetch(
        "/api/buttons",
        {
            method: "POST",
            body: ""
        }
    )
        .then(response => response.json())
        .then(data => {
            let buttons = document.getElementById("buttons");
            buttons.innerHTML = "";
            for(let key in data) {
                let value = data[key];
                createButton(key, value.name, value.color, value.width, value.data)
            }
        });
}

var version = null;
function checkVersion() {
    fetch(
        "/api/version",
        {
            method: "POST",
            body: ""
        }
    )
        .then(response => response.json())
        .then(data => {
            if(data != version)
                loadButtons()
            version = data;
        });
}

window.onload = () => {
    // Load existing buttons on page load
    checkVersion();
    setInterval(checkVersion, 5000);
}